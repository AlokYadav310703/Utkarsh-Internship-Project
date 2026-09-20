import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { requireAuth, requireRoles } from "../middleware/auth.js";
import { ApiError, asyncHandler } from "../middleware/error.js";
import { createCertificatePdf, streamResultSheetPdf } from "../utils/pdf.js";

const router = Router();
router.use(requireAuth, requireRoles("ADMIN", "SUPER_ADMIN"));

router.get("/dashboard", asyncHandler(async (_req, res) => {
  const [totalApplicants, selectedStudents, pendingReviews, contacts] = await Promise.all([
    prisma.application.count({ where: { submittedAt: { not: null } } }),
    prisma.application.count({ where: { status: "SELECTED" } }),
    prisma.application.count({ where: { status: { in: ["PENDING", "UNDER_REVIEW"] } } }),
    prisma.contact.count({ where: { status: "NEW" } }),
  ]);
  res.json({ stats: { totalApplicants, selectedStudents, pendingReviews, contacts } });
}));

router.get("/applications", asyncHandler(async (req, res) => {
  const status = req.query.status;
  const search = req.query.search?.toString();
  const applications = await prisma.application.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { registrationNumber: { contains: search, mode: "insensitive" } },
              { user: { name: { contains: search, mode: "insensitive" } } },
              { user: { email: { contains: search, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: { user: { include: { profile: true } }, documents: true, results: true },
    orderBy: { updatedAt: "desc" },
  });
  res.json({ applications });
}));

router.patch("/applications/:id/status", asyncHandler(async (req, res) => {
  const data = z.object({
    status: z.enum(["UNDER_REVIEW", "SHORTLISTED", "SELECTED", "REJECTED"]),
    reviewRemarks: z.string().optional(),
  }).parse(req.body);
  if (data.status === "SELECTED") {
    const app = await prisma.application.findUnique({ where: { id: req.params.id } });
    const selectedCount = await prisma.application.count({
      where: { sessionYear: app.sessionYear, status: "SELECTED" },
    });
    if (selectedCount >= 11) throw new ApiError(400, "Maximum 11 students can be selected per session");
  }
  const application = await prisma.application.update({
    where: { id: req.params.id },
    data: { ...data, reviewedAt: new Date(), reviewedById: req.user.id },
    include: { user: true },
  });
  await prisma.notification.create({
    data: {
      userId: application.userId,
      title: "Application status updated",
      message: `Your application is now ${application.status}.`,
    },
  });
  res.json({ application });
}));

router.patch("/documents/:id/verify", asyncHandler(async (req, res) => {
  const data = z.object({
    verification: z.enum(["VERIFIED", "INVALID"]),
    remarks: z.string().optional(),
  }).parse(req.body);
  const document = await prisma.document.update({ where: { id: req.params.id }, data });
  res.json({ document });
}));

router.get("/tests", asyncHandler(async (_req, res) => {
  const tests = await prisma.scholarshipTest.findMany({ include: { testResults: true }, orderBy: { createdAt: "desc" } });
  res.json({ tests });
}));

router.post("/tests", asyncHandler(async (req, res) => {
  const data = z.object({
    title: z.string().min(3),
    sessionYear: z.string().min(6),
    testUrl: z.url(),
    startsAt: z.string().optional(),
    endsAt: z.string().optional(),
    isPublished: z.boolean().optional(),
  }).parse(req.body);
  const test = await prisma.scholarshipTest.create({
    data: {
      ...data,
      startsAt: data.startsAt ? new Date(data.startsAt) : undefined,
      endsAt: data.endsAt ? new Date(data.endsAt) : undefined,
      createdById: req.user.id,
    },
  });
  res.status(201).json({ test });
}));

router.post("/tests/:id/assign", asyncHandler(async (req, res) => {
  const { applicationIds } = z.object({ applicationIds: z.array(z.string()).min(1) }).parse(req.body);
  const results = await Promise.all(
    applicationIds.map((applicationId) =>
      prisma.testResult.upsert({
        where: { applicationId_testId: { applicationId, testId: req.params.id } },
        update: {},
        create: { applicationId, testId: req.params.id },
      }),
    ),
  );
  res.json({ assigned: results.length });
}));

router.patch("/test-results/:id", asyncHandler(async (req, res) => {
  const data = z.object({
    score: z.coerce.number().min(0).optional(),
    maxScore: z.coerce.number().min(1).optional(),
    status: z.enum(["PENDING", "QUALIFIED", "SELECTED", "REJECTED"]).optional(),
    remarks: z.string().optional(),
  }).parse(req.body);
  const testResult = await prisma.testResult.update({ where: { id: req.params.id }, data });
  res.json({ testResult });
}));

router.post("/results/publish", asyncHandler(async (req, res) => {
  const { sessionYear, applicationIds } = z.object({
    sessionYear: z.string().min(6),
    applicationIds: z.array(z.string()).max(11),
  }).parse(req.body);
  if (applicationIds.length > 11) throw new ApiError(400, "Only 11 students can be selected");
  const results = await Promise.all(
    applicationIds.map((applicationId, index) =>
      prisma.result.upsert({
        where: { applicationId_sessionYear: { applicationId, sessionYear } },
        update: { status: "SELECTED", rank: index + 1, publishedAt: new Date() },
        create: { applicationId, sessionYear, status: "SELECTED", rank: index + 1, publishedAt: new Date() },
      }),
    ),
  );
  await prisma.application.updateMany({ where: { id: { in: applicationIds } }, data: { status: "SELECTED" } });
  res.json({ results });
}));

router.get("/results/:sessionYear/pdf", asyncHandler(async (req, res) => {
  const results = await prisma.result.findMany({
    where: { sessionYear: req.params.sessionYear, status: "SELECTED" },
    orderBy: [{ rank: "asc" }],
    include: { application: { include: { user: { include: { profile: true } } } } },
  });
  streamResultSheetPdf(res, req.params.sessionYear, results);
}));

router.post("/certificates/:applicationId", asyncHandler(async (req, res) => {
  const data = z.object({ type: z.string().default("SCHOLARSHIP_CERTIFICATE") }).parse(req.body);
  const application = await prisma.application.findUnique({
    where: { id: req.params.applicationId },
    include: { user: { include: { profile: true } } },
  });
  if (!application) throw new ApiError(404, "Application not found");
  if (application.status !== "SELECTED") throw new ApiError(400, "Certificate can be generated only for selected students");
  const certificateNo = `UTC-${application.sessionYear.replace("-", "")}-${Date.now()}`;
  const generated = await createCertificatePdf(application, certificateNo);
  const certificate = await prisma.certificate.create({
    data: {
      applicationId: req.params.applicationId,
      type: data.type,
      certificateNo,
      fileUrl: generated.publicUrl,
    },
  });
  res.status(201).json({ certificate });
}));

router.get("/certificates/:id/pdf", asyncHandler(async (req, res) => {
  const certificate = await prisma.certificate.findUnique({ where: { id: req.params.id } });
  if (!certificate?.fileUrl) throw new ApiError(404, "Certificate PDF not found");
  res.redirect(certificate.fileUrl);
}));

router.get("/faqs", asyncHandler(async (_req, res) => {
  const faqs = await prisma.faq.findMany({ orderBy: [{ sortOrder: "asc" }] });
  res.json({ faqs });
}));

router.post("/faqs", asyncHandler(async (req, res) => {
  const data = z.object({
    question: z.string().min(3),
    answer: z.string().min(3),
    sortOrder: z.coerce.number().default(0),
    isActive: z.boolean().default(true),
  }).parse(req.body);
  const faq = await prisma.faq.create({ data });
  res.status(201).json({ faq });
}));

router.put("/faqs/:id", asyncHandler(async (req, res) => {
  const faq = await prisma.faq.update({ where: { id: req.params.id }, data: req.body });
  res.json({ faq });
}));

router.delete("/faqs/:id", asyncHandler(async (req, res) => {
  await prisma.faq.delete({ where: { id: req.params.id } });
  res.status(204).end();
}));

router.get("/contacts", asyncHandler(async (_req, res) => {
  const contacts = await prisma.contact.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ contacts });
}));

router.patch("/contacts/:id", asyncHandler(async (req, res) => {
  const { status } = z.object({ status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED"]) }).parse(req.body);
  const contact = await prisma.contact.update({ where: { id: req.params.id }, data: { status } });
  res.json({ contact });
}));

router.get("/settings", asyncHandler(async (_req, res) => {
  const settings = await prisma.setting.findMany();
  res.json({ settings: Object.fromEntries(settings.map((item) => [item.key, item.value])) });
}));

router.put("/settings/:key", requireRoles("SUPER_ADMIN"), asyncHandler(async (req, res) => {
  const setting = await prisma.setting.upsert({
    where: { key: req.params.key },
    update: { value: req.body },
    create: { key: req.params.key, value: req.body },
  });
  res.json({ setting });
}));

export default router;

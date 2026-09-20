import { Router } from "express";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { requireAuth, requireRoles, requireVerifiedEmail } from "../middleware/auth.js";
import { ApiError, asyncHandler } from "../middleware/error.js";
import { upload } from "../middleware/upload.js";
import { currentSessionYear, generateRegistrationNumber } from "../utils/registration.js";
import { streamStudentDocumentPdf } from "../utils/pdf.js";

const router = Router();
router.use(requireAuth, requireRoles("STUDENT"), requireVerifiedEmail);

const profileSchema = z.object({
  fatherName: z.string().min(2).optional(),
  motherName: z.string().min(2).optional(),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
  currentClass: z.literal("X"),
  schoolName: z.string().min(2).optional(),
  educationBoard: z.string().optional(),
  previousPercentage: z.coerce.number().min(0).max(100).optional(),
  rollNumber: z.string().optional(),
  address: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  pinCode: z.string().optional(),
});

const ensureApplication = async (userId) =>
  prisma.application.upsert({
    where: { userId },
    update: {},
    create: { userId, sessionYear: currentSessionYear() },
    include: { documents: true, testResults: { include: { test: true } }, results: true, certificates: true },
  });

const getLocalUploadFile = (fileUrl) => {
  if (!fileUrl?.startsWith(env.PUBLIC_UPLOAD_URL)) return null;
  const uploadRoot = path.resolve(env.UPLOAD_DIR);
  const relativeUrl = fileUrl.slice(env.PUBLIC_UPLOAD_URL.length).replace(/^[/\\]+/, "");
  const filePath = path.resolve(uploadRoot, decodeURIComponent(relativeUrl));
  const relativePath = path.relative(uploadRoot, filePath);
  if (relativePath.startsWith("..") || path.isAbsolute(relativePath) || !fs.existsSync(filePath)) return null;
  return filePath;
};

router.get("/dashboard", asyncHandler(async (req, res) => {
  const application = await ensureApplication(req.user.id);
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  res.json({ user: req.user, profile: req.user.profile, application, notifications });
}));

router.put("/profile", asyncHandler(async (req, res) => {
  const data = profileSchema.parse(req.body);
  const profile = await prisma.studentProfile.upsert({
    where: { userId: req.user.id },
    create: { userId: req.user.id, ...data, dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined },
    update: { ...data, dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined },
  });
  await ensureApplication(req.user.id);
  res.json({ profile });
}));

router.get("/application", asyncHandler(async (req, res) => {
  const application = await ensureApplication(req.user.id);
  res.json({ application, profile: req.user.profile });
}));

router.post("/application/draft", asyncHandler(async (req, res) => {
  const application = await ensureApplication(req.user.id);
  if (application.submittedAt) throw new ApiError(409, "Submitted application cannot be edited");
  const profileData = profileSchema.parse(req.body.profile);
  const data = { ...profileData, dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth) : undefined };
  const profile = await prisma.studentProfile.upsert({
    where: { userId: req.user.id },
    create: { userId: req.user.id, ...data },
    update: data,
  });
  res.json({ profile, application });
}));

router.post("/application/submit", asyncHandler(async (req, res) => {
  const application = await ensureApplication(req.user.id);
  if (application.submittedAt) throw new ApiError(409, "Application has already been submitted");
  const profile = await prisma.studentProfile.findUnique({ where: { userId: req.user.id } });
  if (profile?.currentClass !== "X") throw new ApiError(400, "Only Class X students can apply");
  const requiredProfileFields = ["fatherName", "motherName", "gender", "dateOfBirth", "schoolName", "educationBoard", "previousPercentage", "state", "district", "city", "pinCode"];
  const missingProfile = requiredProfileFields.filter((field) => profile?.[field] === null || profile?.[field] === undefined || profile?.[field] === "");
  if (missingProfile.length) throw new ApiError(400, `Missing required profile fields: ${missingProfile.join(", ")}`);
  const requiredDocs = ["PASSPORT_PHOTO", "MARKSHEET", "AADHAAR"];
  const uploaded = application.documents.map((doc) => doc.type);
  const missing = requiredDocs.filter((doc) => !uploaded.includes(doc));
  if (missing.length) throw new ApiError(400, `Missing required documents: ${missing.join(", ")}`);

  const registrationNumber = await generateRegistrationNumber(application.sessionYear);
  const submitted = await prisma.application.update({
    where: { id: application.id },
    data: {
      registrationNumber,
      status: "PENDING",
      declarationAccepted: true,
      submittedAt: new Date(),
    },
    include: { documents: true },
  });
  res.json({ application: submitted });
}));

router.post("/documents/:type", upload.single("file"), asyncHandler(async (req, res) => {
  const type = req.params.type;
  if (!["PASSPORT_PHOTO", "SCHOOL_ID", "MARKSHEET", "AADHAAR"].includes(type)) {
    throw new ApiError(400, "Invalid document type");
  }
  if (!req.file) throw new ApiError(400, "File is required");
  const application = await ensureApplication(req.user.id);
  if (application.submittedAt) throw new ApiError(409, "Cannot upload documents after submission");
  const publicUrl = `${env.PUBLIC_UPLOAD_URL}/${req.file.filename}`;
  const document = await prisma.document.upsert({
    where: { applicationId_type: { applicationId: application.id, type } },
    create: {
      applicationId: application.id,
      type,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      storageKey: req.file.path,
      publicUrl,
    },
    update: {
      fileName: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      storageKey: req.file.path,
      publicUrl,
      verification: "PENDING",
      remarks: null,
    },
  });
  res.status(201).json({ document });
}));

router.get("/documents/:kind/pdf", asyncHandler(async (req, res) => {
  const application = await prisma.application.findUnique({
    where: { userId: req.user.id },
    include: { user: { include: { profile: true } }, results: true, certificates: true },
  });
  if (!application) throw new ApiError(404, "Application not found");
  if (req.params.kind === "certificate") {
    const certificate = application.certificates.at(-1);
    if (certificate?.fileUrl) {
      const certificatePath = getLocalUploadFile(certificate.fileUrl);
      if (certificatePath) {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename="${certificate.certificateNo}.pdf"`);
        res.sendFile(certificatePath);
        return;
      }
    }
  }
  streamStudentDocumentPdf(res, req.params.kind, application);
}));

export default router;

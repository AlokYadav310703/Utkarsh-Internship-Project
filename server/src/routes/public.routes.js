import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { asyncHandler } from "../middleware/error.js";
import { streamResultSheetPdf } from "../utils/pdf.js";

const router = Router();

router.get("/homepage", asyncHandler(async (_req, res) => {
  const [settings, faqs] = await Promise.all([
    prisma.setting.findMany(),
    prisma.faq.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
  ]);
  const byKey = Object.fromEntries(settings.map((item) => [item.key, item.value]));
  res.json({ settings: byKey, faqs });
}));

router.get("/faqs", asyncHandler(async (_req, res) => {
  const faqs = await prisma.faq.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }] });
  res.json({ faqs });
}));

router.post("/contact", asyncHandler(async (req, res) => {
  const data = z.object({
    fullName: z.string().min(2),
    mobile: z.string().min(10),
    email: z.email(),
    registrationNumber: z.string().optional(),
    subject: z.string().min(3),
    message: z.string().min(10),
  }).parse(req.body);
  const contact = await prisma.contact.create({ data });
  res.status(201).json({ contact, message: "Your query has been submitted." });
}));

router.get("/results/:sessionYear", asyncHandler(async (req, res) => {
  const results = await prisma.result.findMany({
    where: { sessionYear: req.params.sessionYear, status: "SELECTED", publishedAt: { not: null } },
    orderBy: [{ rank: "asc" }],
    include: { application: { include: { user: { include: { profile: true } } } } },
  });
  res.json({ results });
}));

router.get("/results/:sessionYear/pdf", asyncHandler(async (req, res) => {
  const results = await prisma.result.findMany({
    where: { sessionYear: req.params.sessionYear, status: "SELECTED", publishedAt: { not: null } },
    orderBy: [{ rank: "asc" }],
    include: { application: { include: { user: { include: { profile: true } } } } },
  });
  streamResultSheetPdf(res, req.params.sessionYear, results);
}));

export default router;

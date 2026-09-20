import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { ApiError, asyncHandler } from "../middleware/error.js";
import { requireAuth } from "../middleware/auth.js";
import { createOtp, sendOtpEmail } from "../utils/email.js";
import { publicUser, signToken } from "../utils/tokens.js";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  mobile: z.string().min(10).optional(),
  password: z.string().min(8),
});

const sendOtpOrFail = async (user, purpose) => {
  const code = await createOtp(user.id, purpose);
  try {
    await sendOtpEmail({ to: user.email, name: user.name, code, purpose });
  } catch (error) {
    console.error(`[MAIL ERROR] ${purpose} OTP for ${user.email}: ${error.code || ""} ${error.message}`);
    throw new ApiError(
      502,
      "OTP email could not be sent. Check MAIL_HOST, MAIL_USER, and MAIL_PASS in .env, then try again.",
    );
  }
};

router.post("/register", asyncHandler(async (req, res) => {
  const data = registerSchema.parse(req.body);
  const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
  if (existing?.isEmailVerified) throw new ApiError(409, "Email already registered");
  if (existing && !existing.isEmailVerified) {
    await sendOtpOrFail(existing, "EMAIL_VERIFY");
    res.json({
      user: publicUser(existing),
      message: "Account already exists but is not verified. A fresh OTP has been sent.",
    });
    return;
  }

  const passwordHash = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      mobile: data.mobile,
      passwordHash,
      profile: { create: { currentClass: "X" } },
    },
  });
  await sendOtpOrFail(user, "EMAIL_VERIFY");
  res.status(201).json({ user: publicUser(user), message: "Registration successful. OTP sent to email." });
}));

router.post("/verify-email", asyncHandler(async (req, res) => {
  const { email, otp } = z.object({ email: z.email(), otp: z.string().length(6) }).parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) throw new ApiError(404, "User not found");

  const code = await prisma.otpCode.findFirst({
    where: { userId: user.id, purpose: "EMAIL_VERIFY", usedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (!code || !(await bcrypt.compare(otp, code.codeHash))) throw new ApiError(400, "Invalid or expired OTP");

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { isEmailVerified: true, otpCodes: { update: { where: { id: code.id }, data: { usedAt: new Date() } } } },
  });
  res.json({ token: signToken(updated), user: publicUser(updated) });
}));

router.post("/resend-verification", asyncHandler(async (req, res) => {
  const { email } = z.object({ email: z.email() }).parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (user && !user.isEmailVerified) {
    await sendOtpOrFail(user, "EMAIL_VERIFY");
  }
  res.json({ message: "If the email exists and is not verified, a new OTP has been sent." });
}));

router.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = z.object({ email: z.email(), password: z.string().min(1) }).parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new ApiError(401, "Invalid email or password");
  }
  res.json({ token: signToken(user), user: publicUser(user) });
}));

router.post("/forgot-password", asyncHandler(async (req, res) => {
  const { email } = z.object({ email: z.email() }).parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (user) {
    await sendOtpOrFail(user, "RESET_PASSWORD");
  }
  res.json({ message: "If the email exists, a reset OTP has been sent." });
}));

router.post("/reset-password", asyncHandler(async (req, res) => {
  const { email, otp, password } = z.object({
    email: z.email(),
    otp: z.string().length(6),
    password: z.string().min(8),
  }).parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) throw new ApiError(404, "User not found");
  const code = await prisma.otpCode.findFirst({
    where: { userId: user.id, purpose: "RESET_PASSWORD", usedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (!code || !(await bcrypt.compare(otp, code.codeHash))) throw new ApiError(400, "Invalid or expired OTP");
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await bcrypt.hash(password, 12),
      otpCodes: { update: { where: { id: code.id }, data: { usedAt: new Date() } } },
    },
  });
  res.json({ message: "Password reset successful" });
}));

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user), profile: req.user.profile });
});

export default router;

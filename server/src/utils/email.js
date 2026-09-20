import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";

const transporter = env.MAIL_HOST && env.MAIL_USER && env.MAIL_PASS
  ? nodemailer.createTransport({
      host: env.MAIL_HOST,
      port: env.MAIL_PORT,
      secure: env.MAIL_SECURE,
      auth: { user: env.MAIL_USER, pass: env.MAIL_PASS },
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000,
    })
  : null;

if (transporter) {
  transporter.verify((err) => {
    if (err) {
      console.error("SMTP Verify Failed");
      console.error(err);
    } else {
      console.log("SMTP Connected Successfully");
    }
  });
}

export const createOtp = async (userId, purpose) => {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const codeHash = await bcrypt.hash(code, 10);
  await prisma.otpCode.create({
    data: {
      userId,
      purpose,
      codeHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });
  return code;
};

export const sendOtpEmail = async ({ to, name, code, purpose }) => {
  const subject = purpose === "RESET_PASSWORD" ? "Reset your Utkarsh password" : "Verify your Utkarsh email";
  const text = `Dear ${name}, your Utkarsh OTP is ${code}. It is valid for 10 minutes.`;
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1a1a2e">
      <h2 style="margin:0 0 12px;color:#1a1a2e">Utkarsh Scholarship OTP</h2>
      <p>Dear ${name},</p>
      <p>Your OTP is:</p>
      <p style="font-size:28px;font-weight:700;letter-spacing:4px;color:#d98c0d">${code}</p>
      <p>This OTP is valid for 10 minutes.</p>
      <p>Asian Development Educational & Research Foundation</p>
    </div>
  `;

  if (!transporter) {
    console.log(`[DEV OTP] ${to}: ${code}. Configure MAIL_USER and MAIL_PASS to send email.`);
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: env.MAIL_FROM,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent:", info.response);
  } catch (err) {
    console.error("SMTP ERROR:");
    console.error(err);
    throw err;
  }
};

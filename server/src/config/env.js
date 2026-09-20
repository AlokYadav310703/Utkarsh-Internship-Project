import dotenv from "dotenv";

dotenv.config();

const readEnv = (key, fallback = "") => {
  const value = process.env[key];
  return typeof value === "string" ? value.trim() : fallback;
};

export const env = {
  NODE_ENV: readEnv("NODE_ENV", "development"),
  PORT: Number(readEnv("PORT", "5000")),
  CLIENT_URL: readEnv("CLIENT_URL", "http://127.0.0.1:5173"),
  DATABASE_URL:
    readEnv("DATABASE_URL") ||
    "postgresql://postgres:postgres@localhost:5432/utkarsh_scholarship?schema=public",
  JWT_SECRET: readEnv("JWT_SECRET", "dev-only-utkarsh-secret"),
  JWT_EXPIRES_IN: readEnv("JWT_EXPIRES_IN", "7d"),
  UPLOAD_DIR: readEnv("UPLOAD_DIR", "server/uploads"),
  PUBLIC_UPLOAD_URL: readEnv("PUBLIC_UPLOAD_URL", "http://127.0.0.1:5000/uploads"),
  MAIL_HOST: readEnv("MAIL_HOST"),
  MAIL_PORT: Number(readEnv("MAIL_PORT", "587")),
  MAIL_SECURE: readEnv("MAIL_SECURE") === "true",
  MAIL_USER: readEnv("MAIL_USER"),
  MAIL_PASS: readEnv("MAIL_PASS"),
  MAIL_FROM: readEnv("MAIL_FROM", "Utkarsh Scholarship <noreply@aderf.co.in>"),
};

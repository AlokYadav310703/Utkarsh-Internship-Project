import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import { env } from "../config/env.js";
import { ApiError } from "./error.js";

fs.mkdirSync(path.resolve(env.UPLOAD_DIR), { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.resolve(env.UPLOAD_DIR)),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safeName}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowed.includes(file.mimetype)) {
      cb(new ApiError(400, "Only JPG, PNG, and PDF files are allowed"));
      return;
    }
    cb(null, true);
  },
});

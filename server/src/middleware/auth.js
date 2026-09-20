import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
import { env } from "../config/env.js";
import { ApiError, asyncHandler } from "./error.js";

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : req.cookies?.token;
  if (!token) throw new ApiError(401, "Authentication required");

  const payload = jwt.verify(token, env.JWT_SECRET);
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    include: { profile: true },
  });
  if (!user || !user.isActive) throw new ApiError(401, "Invalid or inactive account");
  req.user = user;
  next();
});

export const requireRoles = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user?.role)) {
    throw new ApiError(403, "You do not have permission to access this resource");
  }
  next();
};

export const requireVerifiedEmail = (req, _res, next) => {
  if (!req.user?.isEmailVerified) throw new ApiError(403, "Email verification is required");
  next();
};

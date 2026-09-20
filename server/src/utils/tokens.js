import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const signToken = (user) =>
  jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

export const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  mobile: user.mobile,
  role: user.role,
  isEmailVerified: user.isEmailVerified,
});

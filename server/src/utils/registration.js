import { prisma } from "../config/prisma.js";

export const currentSessionYear = () => {
  const now = new Date();
  const start = now.getMonth() >= 5 ? now.getFullYear() : now.getFullYear() - 1;
  return `${start}-${String(start + 1).slice(-2)}`;
};

export const generateRegistrationNumber = async (sessionYear) => {
  const count = await prisma.application.count({
    where: { sessionYear, registrationNumber: { not: null } },
  });
  const year = sessionYear.split("-")[0];
  return `UTK${year}-${String(count + 1).padStart(5, "0")}`;
};

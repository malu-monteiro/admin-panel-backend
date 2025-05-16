import { randomBytes } from "crypto";

import prisma from "../../../prisma";

const ONE_HOUR_IN_MS = 3600000;
const TOKEN_BYTE_LENGTH = 32;

export const generateEmailVerificationToken = async (
  adminId: string,
  newEmail?: string
) => {
  const token = randomBytes(TOKEN_BYTE_LENGTH).toString("hex");
  const expiresAt = new Date(Date.now() + ONE_HOUR_IN_MS);

  return prisma.emailVerificationToken.create({
    data: {
      token,
      adminId,
      expiresAt,
      newEmail,
    },
  });
};

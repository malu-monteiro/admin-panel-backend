import { randomBytes } from "crypto";
import prisma from "../../../prisma";

const ONE_HOUR_IN_MS = 3600000;
const TOKEN_BYTE_LENGTH = 32;

export const generateResetToken = async (adminId: string) => {
  await prisma.passwordResetToken.deleteMany({
    where: { adminId },
  });

  const token = randomBytes(TOKEN_BYTE_LENGTH).toString("hex");
  const expiresAt = new Date(Date.now() + ONE_HOUR_IN_MS);

  return prisma.passwordResetToken.create({
    data: {
      token,
      adminId,
      expiresAt,
    },
  });
};

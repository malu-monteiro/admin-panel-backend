import dotenv from "dotenv";
import prisma from "../prisma";
import nodemailer from "nodemailer";
import fastifyRateLimit from "@fastify/rate-limit";

import { compare, hash } from "bcryptjs";

import { Admin } from "@prisma/client";
import { generateResetToken } from "../utils/passwordReset";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { generateEmailVerificationToken } from "../utils/emailVerification";

import jwt, { JwtPayload as DefaultJwtPayload } from "jsonwebtoken";

declare module "fastify" {
  interface FastifyRequest {
    admin: Admin | null;
  }
}

dotenv.config();

interface LoginBody {
  email: string;
  password: string;
}

interface JwtPayload {
  adminId: string;
  exp?: number;
  iat?: number;
}

interface CustomJwtPayload extends DefaultJwtPayload {
  adminId: string;
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET not defined!");
}

const JWT_SECRET = process.env.JWT_SECRET;

const rateLimitConfig = {
  login: {
    max: 5,
    timeWindow: "5 minutes",
  },
  passwordReset: {
    max: 3,
    timeWindow: "1 hour",
  },
};

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function authRoutes(fastify: FastifyInstance) {
  await fastify.register(fastifyRateLimit, {
    global: false,
    allowList: process.env.NODE_ENV === "test" ? [] : ["127.0.0.1"], // Allowed IPs
    keyGenerator: (req) => {
      return req.headers["x-forwarded-for"]?.toString() || req.ip;
    },
  });

  fastify.decorateRequest("admin", null);

  await fastify.register(async (fastify) => {
    const createToken = (adminId: string): string => {
      return jwt.sign({ adminId }, JWT_SECRET, {
        expiresIn: "15m",
      });
    };

    const authenticate = async (
      request: FastifyRequest,
      reply: FastifyReply
    ) => {
      try {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
          return reply.status(401).send({ error: "Token not provided" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
          return reply.status(401).send({ error: "Invalid token format" });
        }

        try {
          const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

          const now = Date.now().valueOf() / 1000;
          if (typeof decoded.exp !== "undefined" && decoded.exp < now) {
            return reply.status(401).send({ error: "Token expired " });
          }

          const admin = await prisma.admin.findUnique({
            where: { id: decoded.adminId },
          });

          if (!admin) {
            return reply.status(401).send({ error: "Admin not found" });
          }

          request.admin = admin;
        } catch (jwtError) {
          fastify.log.error("JWT Error:", {
            error: jwtError,
            token: token.substring(0, 10) + "...",
          });

          if (jwtError instanceof jwt.TokenExpiredError) {
            return reply.status(401).send({ error: "Token expired" });
          }

          return reply.status(401).send({ error: "Invalid token" });
        }
      } catch (error) {
        fastify.log.error("Auth Middleware Error:", error);
        return reply.status(500).send({ error: "Authentication error" });
      }
    };

    fastify.post("/sign-in", {
      config: {
        rateLimit: rateLimitConfig.login,
      },
      handler: async (request: FastifyRequest<{ Body: LoginBody }>, reply) => {
        const { email, password } = request.body;

        try {
          const admin = await prisma.admin.findUnique({
            where: { email },
          });

          if (!admin || !(await compare(password, admin.password))) {
            return reply.status(401).send({ error: "Invalid credentials" });
          }

          const accessToken = createToken(admin.id);
          const refreshToken = jwt.sign({ adminId: admin.id }, JWT_SECRET, {
            expiresIn: "7d",
          });

          reply
            .setCookie("refreshToken", refreshToken, {
              httpOnly: true,
              secure: true,
              sameSite: "strict",
              path: "/auth/refresh-token",
            })
            .send({ token: accessToken });
        } catch (error) {
          fastify.log.error(error);
          reply.code(500).send({ error: "Error during login" });
        }
      },
    });

    fastify.post("/refresh-token", async (request, reply) => {
      try {
        const refreshToken =
          request.cookies.refreshToken || request.headers["x-refresh-token"];

        if (!refreshToken || Array.isArray(refreshToken)) {
          return reply
            .status(401)
            .send({ error: "Refresh token not provided" });
        }

        const decoded = jwt.verify(
          refreshToken,
          JWT_SECRET
        ) as CustomJwtPayload;

        const admin = await prisma.admin.findUnique({
          where: { id: decoded.adminId },
        });
        if (!admin) throw new Error("Admin not found");

        const newAccessToken = createToken(admin.id);
        reply.send({ token: newAccessToken });
      } catch (error) {
        reply.status(401).send({ error: "Refresh token invalid or expired" });
      }
    });

    fastify.post("/forgot-password", {
      config: {
        rateLimit: rateLimitConfig.passwordReset,
      },
      handler: async (request, reply) => {
        const { email } = request.body as { email: string };

        try {
          const admin = await prisma.admin.findUnique({
            where: { email },
            select: { id: true, emailVerified: true },
          });

          if (!admin) {
            return reply.send({
              message: "If the email exists, we will send you a recovery link",
            });
          }

          const { token } = await generateResetToken(admin.id);
          const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

          await transporter.sendMail({
            from: '"Pawfaction" <no-reply@example.com>',
            to: email,
            subject: "Password Reset",
            html: `<p>Click on the link to reset your password: <a href="${resetLink}">${resetLink}<a/></p>`,
          });

          reply.send({ message: "Recovery link sent to your email" });
        } catch (error) {
          fastify.log.error("Forgot password error:", error);
          reply
            .status(500)
            .send({ error: "Error processing forgot-password request" });
        }
      },
    });

    fastify.post("/reset-password", async (request, reply) => {
      const { token, newPassword } = request.body as {
        token: string;
        newPassword: string;
      };

      try {
        if (!token) {
          return reply.status(400).send({ error: "Missing token" });
        }

        if (newPassword.length < 6) {
          return reply.status(400).send({
            error: "Invalid password",
            message: "Password must be at least 6 characters",
          });
        }

        if (!/(?=.*[A-Za-z])(?=.*\d)/.test(newPassword)) {
          return reply.status(400).send({
            error: "Invalid password",
            message: "Must contain at least one letter and one number",
          });
        }

        const resetToken = await prisma.passwordResetToken.findUnique({
          where: { token },
          include: { admin: true },
        });

        if (!resetToken || resetToken.used) {
          return reply.status(400).send({ error: "Invalid token" });
        }

        if (resetToken.expiresAt < new Date()) {
          return reply.status(400).send({ error: "Expired token" });
        }

        const hashedPassword = await hash(newPassword, 10);
        await prisma.$transaction([
          prisma.admin.update({
            where: { id: resetToken.adminId },
            data: { password: hashedPassword },
          }),
          prisma.passwordResetToken.update({
            where: { id: resetToken.id },
            data: { used: true },
          }),
        ]);

        reply.send({ message: "Password reset successfully!" });
      } catch (error) {
        fastify.log.error("Password reset error:", error);
        reply.status(500).send({
          error: "Password reset failed",
          message: "Failed to reset password. Please try again.",
        });
      }
    });

    fastify.post(
      "/send-verification-email",
      {
        preHandler: authenticate,
      },
      async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          if (!request.admin) {
            return reply.status(401).send({ error: "Unauthorized" });
          }

          const admin = await prisma.admin.findUnique({
            where: { id: request.admin.id },
            select: { email: true, emailVerified: true },
          });

          if (!admin) {
            return reply.status(404).send({ error: "Admin not found" });
          }

          if (admin.emailVerified) {
            return reply.status(400).send({ error: "Email already verified" });
          }

          if (!process.env.FRONTEND_URL) {
            throw new Error("FRONTEND_URL environment variable not set");
          }

          const { token } = await generateEmailVerificationToken(
            request.admin.id
          );
          const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

          await transporter.sendMail({
            from: '"Pawfaction" <noreply@example.com>',
            to: admin.email,
            subject: "Verify your email",
            html: `Click here to verify: <a href="${verificationLink}">${verificationLink}</a>`,
          });

          reply.send({ message: "Verification email sent" });
        } catch (error) {
          fastify.log.error("Send verification email error:", error);
          reply
            .status(500)
            .send({ error: "Failed to send verification email" });
        }
      }
    );

    fastify.post("/verify-email", async (request, reply) => {
      const { token } = request.body as { token: string };

      try {
        const verificationToken =
          await prisma.emailVerificationToken.findUnique({
            where: { token },
            include: { admin: true },
          });

        if (!verificationToken) {
          return reply.status(400).send({ error: "Invalid token" });
        }

        if (verificationToken.expiresAt < new Date()) {
          return reply.status(400).send({ error: "Expired token" });
        }

        await prisma.$transaction(async (tx) => {
          if (verificationToken.newEmail) {
            await tx.admin.update({
              where: { id: verificationToken.adminId },
              data: {
                email: verificationToken.newEmail,
                emailVerified: true,
              },
            });
          } else {
            await tx.admin.update({
              where: { id: verificationToken.adminId },
              data: { emailVerified: true },
            });
          }
          await tx.emailVerificationToken.delete({
            where: { id: verificationToken.id },
          });
        });
        reply.send({
          message: "Email verified successfully!",
          newEmail: verificationToken.newEmail,
        });
      } catch (error) {
        fastify.log.error("Verify email error:", error);
        reply.status(500).send({ error: "Failed to verify email" });
      }
    });

    fastify.get(
      "/me",
      {
        preHandler: authenticate,
      },
      async (request, reply) => {
        try {
          const admin = await prisma.admin.findUnique({
            where: { id: request.admin?.id },
            select: {
              id: true,
              email: true,
              name: true,
              createdAt: true,
              updatedAt: true,
            },
          });

          if (!admin)
            return reply.status(404).send({ error: "Admin not found" });

          reply.send({
            name: admin.name,
            email: admin.email,
          });
        } catch (error) {
          fastify.log.error("Error fetching user data:", error);
          reply.code(500).send({ error: "Error fetching user data" });
        }
      }
    );

    fastify.patch(
      "/update",
      {
        preHandler: authenticate,
      },
      async (request: FastifyRequest, reply: FastifyReply) => {
        if (!request.admin) {
          return reply.status(401).send({ error: "Unauthorized" });
        }
        const adminId = request.admin.id;

        const { email: newEmail, name } = request.body as {
          email: string;
          name: string;
        };

        try {
          if (newEmail) {
            const admin = await prisma.admin.findUnique({
              where: { id: request.admin?.id },
              select: { email: true },
            });

            if (admin?.email !== newEmail) {
              const { token } = await generateEmailVerificationToken(
                adminId,
                newEmail
              );

              const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
              await transporter.sendMail({
                to: newEmail,
                subject: "Verify your new email",
                html: `Click to verify: <a href="${verificationLink}">${verificationLink}</a>`,
              });

              return reply.send({
                message: "Verification email sent to new address",
                requiresVerification: true,
              });
            }
          }

          const updatedAdmin = await prisma.admin.update({
            where: { id: adminId },
            data: { name },
          });

          reply.send({
            email: updatedAdmin.email,
            message: "Data updated successfully",
          });
        } catch (error) {
          fastify.log.error("Update profile error:", error);
          reply.code(500).send({ error: "Error updating data" });
        }
      }
    );

    fastify.patch(
      "/update-password",
      { preHandler: authenticate },
      async (request, reply) => {
        try {
          const { currentPassword, newPassword } = request.body as {
            currentPassword: string;
            newPassword: string;
          };

          const admin = await prisma.admin.findUnique({
            where: { id: request.admin?.id },
          });
          if (!admin || !(await compare(currentPassword, admin.password))) {
            return reply
              .code(401)
              .send({ error: "Current password is incorrect" });
          }

          const hashedPassword = await hash(newPassword, 10);
          await prisma.admin.update({
            where: { id: request.admin?.id },
            data: { password: hashedPassword },
          });

          reply.send({ message: "Password updated successfully" });
        } catch (error) {
          fastify.log.error("Update password error:", error);
          reply.status(500).send({ error: "Error updating password" });
        }
      }
    );
  });
}

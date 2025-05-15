import { FastifyReply, FastifyRequest } from "fastify";

import {
  ForgotPasswordBody,
  LoginBody,
  ResetPasswordBody,
  VerifyEmailBody,
} from "../types/authentication";

import { AuthService } from "../services/auth-sevice";

export const AuthController = {
  async signIn(
    request: FastifyRequest<{ Body: LoginBody }>,
    reply: FastifyReply
  ) {
    try {
      const { accessToken, refreshToken } = await AuthService.signIn(
        request.body
      );

      reply
        .setCookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          path: "/auth/refresh-token",
        })
        .send({ token: accessToken });
    } catch (error: any) {
      request.log.error(error);
      reply.status(401).send({ error: error.message || "Invalid credentials" });
    }
  },

  async refreshToken(request: FastifyRequest, reply: FastifyReply) {
    try {
      const refreshToken =
        request.cookies.refreshToken || request.headers["x-refresh-token"];
      if (!refreshToken || Array.isArray(refreshToken)) {
        return reply.status(401).send({ error: "Refresh token not provided" });
      }

      const newAccessToken = await AuthService.refreshToken(refreshToken);
      reply.send({ token: newAccessToken });
    } catch (error) {
      reply.status(401).send({ error: "Refresh token invalid or expired" });
    }
  },

  async forgotPassword(
    request: FastifyRequest<{ Body: ForgotPasswordBody }>,
    reply: FastifyReply
  ) {
    try {
      await AuthService.forgotPassword(request.body);
      reply.send({
        message: "If the email exists, we will send you a recovery link",
      });
    } catch (error) {
      request.log.error("Forgot password error:", error);
      reply
        .status(500)
        .send({ error: "Error processing forgot-password request" });
    }
  },

  async resetPassword(
    request: FastifyRequest<{ Body: ResetPasswordBody }>,
    reply: FastifyReply
  ) {
    try {
      await AuthService.resetPassword(request.body);
      reply.send({ message: "Password reset successfully!" });
    } catch (error: any) {
      request.log.error("Password reset error:", error);
      reply.status(400).send({
        error: error.message || "Failed to reset password. Please try again.",
      });
    }
  },

  async sendVerificationEmail(request: FastifyRequest, reply: FastifyReply) {
    try {
      if (!request.admin) {
        return reply.status(401).send({ error: "Unauthorized" });
      }

      await AuthService.sendVerificationEmail(request.admin.id);
      reply.send({ message: "Verification email sent" });
    } catch (error: any) {
      request.log.error("Send verification email error:", error);
      reply
        .status(500)
        .send({ error: error.message || "Failed to send verification email" });
    }
  },

  async verifyEmail(
    request: FastifyRequest<{ Body: VerifyEmailBody }>,
    reply: FastifyReply
  ) {
    try {
      const newEmail = await AuthService.verifyEmail(request.body);
      reply.send({
        message: "Email verified successfully!",
        newEmail,
      });
    } catch (error: any) {
      request.log.error("Verify email error:", error);
      reply
        .status(400)
        .send({ error: error.message || "Failed to verify email" });
    }
  },
};

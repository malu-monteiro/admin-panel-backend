import { Admin } from "@prisma/client";

import { JwtPayload as DefaultJwtPayload } from "jsonwebtoken";

import { FastifyRequest as FastifyRequestBase } from "fastify";

declare module "fastify" {
  interface FastifyRequest extends FastifyRequestBase {
    admin: Admin;
  }
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface JwtPayload extends DefaultJwtPayload {
  adminId: string;
}

export interface ResetPasswordBody {
  token: string;
  newPassword: string;
}

export interface ForgotPasswordBody {
  email: string;
}

export interface VerifyEmailBody {
  token: string;
}

export interface UpdateProfileBody {
  email?: string;
  name?: string;
}

export interface UpdatePasswordBody {
  currentPassword: string;
  newPassword: string;
}

export interface EmailTemplateParams {
  link: string;
}

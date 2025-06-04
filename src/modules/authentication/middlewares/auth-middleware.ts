import { FastifyRequest, FastifyReply } from "fastify";

import jwt from "jsonwebtoken";

import prisma from "../../../prisma";

import { JwtPayload } from "../types";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return reply.status(401).send({ error: "Token not provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return reply.status(401).send({ error: "Invalid token format" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const now = Date.now().valueOf() / 1000;
    if (typeof decoded.exp !== "undefined" && decoded.exp < now) {
      return reply.status(401).send({ error: "Token expired" });
    }

    const admin = await prisma.admin.findUnique({
      where: {
        id: decoded.adminId,
      },
    });

    if (!admin) {
      return reply.status(401).send({ error: "Admin not found" });
    }
    request.admin = admin;
  } catch (error) {
    reply.status(401).send({ error: "Invalid token" });
  }
}

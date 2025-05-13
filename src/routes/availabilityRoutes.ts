// import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

// import dayjs from "dayjs";
// import timezone from "dayjs/plugin/timezone";
// import utc from "dayjs/plugin/utc";
// import prisma from "../prisma";

// dayjs.extend(utc);
// dayjs.extend(timezone);

// interface WorkingHours {
//   startTime: string;
//   endTime: string;
// }

// interface Service {
//   id?: number;
//   name: string;
// }

// interface BlockRequest {
//   date: string;
//   startTime?: string;
//   endTime?: string;
// }

// const MIN_SERVICE_NAME_LENGTH = 3;
// const MAX_SERVICE_NAME_LENGTH = 50;
// const SERVICE_NAME_REGEX = /^[a-zA-ZÀ-ÿ0-9\s\-_]+$/;

// const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
// const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):00$/;
// const DEFAULT_TIMEZONE = "America/Sao_Paulo";

// export async function availabilityRoutes(fastify: FastifyInstance) {
//   fastify.register(async (fastify) => {
//     fastify.get(
//       "/working-hours",
//       async (request: FastifyRequest, reply: FastifyReply) => {
//         try {
//           const workingHours = await prisma.workingHours.findFirst({
//             orderBy: { createdAt: "desc" },
//           });

//           if (!workingHours) {
//             const defaultHours = await prisma.workingHours.create({
//               data: {
//                 startTime: "08:00",
//                 endTime: "18:00",
//               },
//             });
//             return defaultHours;
//           }

//           return workingHours;
//         } catch (error) {
//           fastify.log.error("Error fetching working hours:", error);
//           return reply
//             .status(500)
//             .send({ error: "Error fetching working hours" });
//         }
//       }
//     );

//     fastify.post(
//       "/working-hours",
//       async (request: FastifyRequest, reply: FastifyReply) => {
//         const { startTime, endTime } = request.body as WorkingHours;

//         if (
//           !startTime ||
//           !endTime ||
//           !timeRegex.test(startTime) ||
//           !timeRegex.test(endTime)
//         ) {
//           return reply
//             .status(400)
//             .send({ error: "Invalid time format. Use HH:00" });
//         }

//         if (startTime >= endTime) {
//           return reply.status(400).send({
//             error: "Opening time must be before closing time",
//           });
//         }

//         try {
//           const existingHours = await prisma.workingHours.findFirst();

//           if (existingHours) {
//             const updatedHours = await prisma.workingHours.update({
//               where: { id: existingHours.id },
//               data: { startTime, endTime },
//             });
//             return reply.status(200).send(updatedHours);
//           } else {
//             const newHours = await prisma.workingHours.create({
//               data: { startTime, endTime },
//             });

//             return reply.status(201).send(newHours);
//           }
//         } catch (error) {
//           fastify.log.error("Error saving working hours:", error);
//           return reply
//             .status(500)
//             .send({ error: "Error saving working hours" });
//         }
//       }
//     );

//     fastify.get(
//       "/services",
//       async (request: FastifyRequest, reply: FastifyReply) => {
//         try {
//           const services = await prisma.service.findMany({
//             orderBy: { name: "asc" },
//           });

//           return services;
//         } catch (error) {
//           fastify.log.error("Error fetching services:", error);
//           return reply.status(500).send({
//             error: "Failed to load services",
//           });
//         }
//       }
//     );

//     fastify.post(
//       "/services",
//       async (request: FastifyRequest, reply: FastifyReply) => {
//         try {
//           const { name } = request.body as Service;

//           if (!name || name.trim().length < MIN_SERVICE_NAME_LENGTH) {
//             return reply.status(400).send({
//               error: `Service name must have at least ${MIN_SERVICE_NAME_LENGTH} characters`,
//             });
//           }

//           if (name.trim().length > MAX_SERVICE_NAME_LENGTH) {
//             return reply.status(400).send({
//               error: `Service name exceeds ${MAX_SERVICE_NAME_LENGTH} characters`,
//             });
//           }

//           if (!SERVICE_NAME_REGEX.test(name.trim())) {
//             return reply.status(400).send({
//               error:
//                 "Invalid characters (allowed: letters, numbers, spaces, hyphens)",
//             });
//           }

//           const existingService = await prisma.service.findFirst({
//             where: {
//               name: {
//                 equals: name.trim().toLocaleLowerCase(),
//               },
//             },
//           });

//           if (existingService) {
//             return reply.status(409).send({ error: "Service already exists" });
//           }

//           const service = await prisma.service.create({
//             data: { name: name.trim() },
//           });

//           return reply.status(201).send(service);
//         } catch (error) {
//           fastify.log.error("Error creating service:", error);
//           return reply.status(500).send({
//             error: "Error creating service",
//           });
//         }
//       }
//     );

//     fastify.delete(
//       "/services/:id",
//       async (request: FastifyRequest, reply: FastifyReply) => {
//         const { id } = request.params as { id: string };
//         const serviceId = parseInt(id);

//         if (isNaN(serviceId)) {
//           return reply.status(400).send({ error: "Invalid ID" });
//         }

//         try {
//           await prisma.service.delete({
//             where: { id: serviceId },
//           });

//           return { message: "Service deleted successfully" };
//         } catch (error) {
//           fastify.log.error("Error deleting service:", error);
//           const prismaError = error as { code?: string };
//           if (prismaError.code === "P2025") {
//             return reply.status(404).send({
//               error: "Service not found",
//             });
//           }

//           return reply.status(500).send({
//             error: "Error deleting service",
//           });
//         }
//       }
//     );

//     fastify.get(
//       "/blocks",
//       async (request: FastifyRequest, reply: FastifyReply) => {
//         const { startDate, endDate } = request.query as {
//           startDate?: string;
//           endDate?: string;
//         };

//         if (!startDate || !endDate) {
//           return reply.status(400).send({
//             error: "Both startDate and endDate are required",
//           });
//         }

//         const parsedStart = dayjs
//           .tz(startDate, "YYYY-MM-DD", DEFAULT_TIMEZONE)
//           .toDate();
//         const parsedEnd = dayjs
//           .tz(endDate, "YYYY-MM-DD", DEFAULT_TIMEZONE)
//           .toDate();

//         if (isNaN(parsedStart.getTime()) || isNaN(parsedEnd.getTime())) {
//           return reply
//             .status(400)
//             .send({ error: "Invalid date format. Use YYYY-MM-DD" });
//         }

//         try {
//           const blocks = await prisma.availability.findMany({
//             where: {
//               date: {
//                 gte: parsedStart,
//                 lte: parsedEnd,
//               },
//             },
//             include: {
//               blockedSlots: true,
//             },
//           });

//           return blocks.map((block) => ({
//             id: block.id,
//             date: block.date,
//             isBlocked: block.isBlocked,
//             blockedSlots: block.blockedSlots.map((slot) => ({
//               id: slot.id,
//               startTime: slot.startTime,
//               endTime: slot.endTime,
//             })),
//           }));
//         } catch (error) {
//           fastify.log.error("Error fetching blocks:", error);
//           return reply.status(500).send({ error: "Error fetching blocks" });
//         }
//       }
//     );

//     fastify.post(
//       "/blocks",
//       async (request: FastifyRequest, reply: FastifyReply) => {
//         const { date, startTime, endTime } = request.body as BlockRequest;

//         const parsedDate = dayjs
//           .tz(date, "YYYY-MM-DD", DEFAULT_TIMEZONE)
//           .startOf("day")
//           .toDate();

//         const existingBlock = await prisma.availability.findUnique({
//           where: { date: parsedDate },
//           include: { blockedSlots: true },
//         });

//         if (!startTime || !endTime) {
//           if (existingBlock?.isBlocked) {
//             return reply.status(400).send({
//               error: "Day is already fully blocked",
//             });
//           }

//           const availability = await prisma.availability.upsert({
//             where: { date: parsedDate },
//             update: { isBlocked: true },
//             create: { date: parsedDate, isBlocked: true },
//           });

//           return reply.status(201).send(availability);
//         }

//         if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
//           return reply
//             .status(400)
//             .send({ error: "Invalid time format. Use HH:mm" });
//         }

//         const startDateTime = dayjs
//           .tz(`${date}T${startTime}`, "YYYY-MM-DDTHH:mm", DEFAULT_TIMEZONE)
//           .toDate();
//         const endDateTime = dayjs
//           .tz(`${date}T${endTime}`, "YYYY-MM-DDTHH:mm", DEFAULT_TIMEZONE)
//           .toDate();

//         if (startDateTime >= endDateTime) {
//           return reply.status(400).send({
//             error: "Start time must be before end time",
//           });
//         }

//         if (existingBlock?.isBlocked) {
//           return reply.status(400).send({
//             error: "Day is already fully blocked",
//           });
//         }

//         const overlaps = existingBlock?.blockedSlots.some((slot) => {
//           const slotStartDate = dayjs
//             .tz(
//               `${date}T${slot.startTime}`,
//               "YYYY-MM-DDTHH:mm",
//               DEFAULT_TIMEZONE
//             )
//             .toDate();
//           const slotEndDate = dayjs
//             .tz(`${date}T${slot.endTime}`, "YYYY-MM-DDTHH:mm", DEFAULT_TIMEZONE)
//             .toDate();

//           return startDateTime < slotEndDate && endDateTime > slotStartDate;
//         });

//         if (overlaps) {
//           return reply
//             .status(400)
//             .send({ error: "Time slot overlaps with an existing block" });
//         }

//         try {
//           const availability = await prisma.availability.upsert({
//             where: { date: parsedDate },
//             update: {
//               blockedSlots: {
//                 create: { startTime: startTime, endTime: endTime },
//               },
//             },
//             create: {
//               date: parsedDate,
//               blockedSlots: {
//                 create: { startTime: startTime, endTime: endTime },
//               },
//             },
//             include: { blockedSlots: true },
//           });

//           return reply.status(201).send(availability);
//         } catch (error) {
//           fastify.log.error("Error creating block slot:", error);
//           return reply.status(500).send({ error: "Error creating block slot" });
//         }
//       }
//     );

//     fastify.delete(
//       "/blocks/:id",
//       async (request: FastifyRequest, reply: FastifyReply) => {
//         const { id } = request.params as { id: string };
//         const parsedId = parseInt(id);

//         if (isNaN(parsedId)) {
//           return reply.status(400).send({ error: "Invalid ID" });
//         }

//         try {
//           const availability = await prisma.availability.findUnique({
//             where: { id: parsedId },
//           });

//           if (availability?.isBlocked) {
//             await prisma.availability.update({
//               where: { id: parsedId },
//               data: { isBlocked: false },
//             });
//             return reply.send({ message: "Day block removed successfully" });
//           }

//           await prisma.blockedSlot.delete({ where: { id: parsedId } });
//           return { message: "Time slot removed successfully" };
//         } catch (error) {
//           fastify.log.error("Error removing block slot:", error);
//           return { message: "Day block removed successfully" };
//         }
//       }
//     );
//   });
// }

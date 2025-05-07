import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await hash("123456", 12);

  await prisma.admin.upsert({
    where: { email: "admin@teste.com" },
    update: {},
    create: {
      email: "admin@teste.com",
      name: "Admin",
      password: password,
    },
  });

  await prisma.workingHours.upsert({
    where: { id: 1 },
    update: {},
    create: {
      startTime: "08:00",
      endTime: "18:00",
    },
  });
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

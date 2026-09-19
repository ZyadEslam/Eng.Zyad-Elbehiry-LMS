import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
async function main() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "Admin@12345";
  const name = process.env.ADMIN_NAME || "Eng. Zyad Elbehiry";
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({ where: { username }, update: { role: "ADMIN", active: true }, create: { username, name, passwordHash, role: "ADMIN" } });
  console.log(`✔ admin user ready → username: ${username}`);
}
main().finally(() => prisma.$disconnect());

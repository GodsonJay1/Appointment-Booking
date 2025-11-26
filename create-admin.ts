import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "renderjay@gmail.com";
  const password = "123456789";

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: { email, password: hashedPassword, isAdmin: true },
  });

  console.log("Admin created:", admin);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

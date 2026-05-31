import "dotenv/config";
import { PrismaClient } from "@prisma/client";

console.log("Creating Prisma Client...");

const prisma = new PrismaClient();

console.log("Prisma Client Created");


export default prisma;
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "~~/prisma/generated/client";

// Prisma 7 has no native query engine; libsql opens the SQLite file at DATABASE_URL.
export const prisma = new PrismaClient({
	adapter: new PrismaLibSql({ url: process.env.DATABASE_URL! }),
});

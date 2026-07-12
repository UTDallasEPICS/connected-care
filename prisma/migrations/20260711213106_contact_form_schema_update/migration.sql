/*
  Warnings:

  - You are about to drop the column `services` on the `Request` table. All the data in the column will be lost.
  - Added the required column `isAdult` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NonEmployee" ADD COLUMN "identification" TEXT;

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN "ageAtRegistration" INTEGER;

-- CreateTable
CREATE TABLE "RequestTherapy" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "requestId" INTEGER NOT NULL,
    CONSTRAINT "RequestTherapy_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RequestComplementaryService" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "requestId" INTEGER NOT NULL,
    CONSTRAINT "RequestComplementaryService_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RequestWorkshop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "requestId" INTEGER NOT NULL,
    CONSTRAINT "RequestWorkshop_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Request" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "idNumber" TEXT NOT NULL,
    "isAdult" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Request" ("createdAt", "email", "firstName", "id", "idNumber", "lastName", "middleName", "phone", "whatsapp") SELECT "createdAt", "email", "firstName", "id", "idNumber", "lastName", "middleName", "phone", "whatsapp" FROM "Request";
DROP TABLE "Request";
ALTER TABLE "new_Request" RENAME TO "Request";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

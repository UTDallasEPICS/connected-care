/*
  Warnings:

  - You are about to drop the column `phone` on the `Request` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "RequestPhone" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" TEXT NOT NULL,
    "requestId" INTEGER NOT NULL,
    CONSTRAINT "RequestPhone_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
    "whatsapp" TEXT NOT NULL,
    "idNumber" TEXT NOT NULL,
    "streetName" TEXT NOT NULL,
    "streetNum" TEXT NOT NULL,
    "buildingNum" TEXT,
    "postCode" TEXT NOT NULL,
    "isAdult" BOOLEAN NOT NULL,
    "patientFirstName" TEXT NOT NULL,
    "patientMiddleName" TEXT,
    "patientLastName" TEXT NOT NULL,
    "patientAge" INTEGER NOT NULL,
    "diagnosed" BOOLEAN NOT NULL,
    "returnPatient" BOOLEAN NOT NULL,
    "previousVisitDate" DATETIME,
    "wantsEval" BOOLEAN NOT NULL,
    "hasReferral" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Request" ("buildingNum", "createdAt", "diagnosed", "email", "firstName", "hasReferral", "id", "idNumber", "isAdult", "lastName", "middleName", "patientAge", "patientFirstName", "patientLastName", "patientMiddleName", "postCode", "previousVisitDate", "returnPatient", "streetName", "streetNum", "wantsEval", "whatsapp") SELECT "buildingNum", "createdAt", "diagnosed", "email", "firstName", "hasReferral", "id", "idNumber", "isAdult", "lastName", "middleName", "patientAge", "patientFirstName", "patientLastName", "patientMiddleName", "postCode", "previousVisitDate", "returnPatient", "streetName", "streetNum", "wantsEval", "whatsapp" FROM "Request";
DROP TABLE "Request";
ALTER TABLE "new_Request" RENAME TO "Request";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

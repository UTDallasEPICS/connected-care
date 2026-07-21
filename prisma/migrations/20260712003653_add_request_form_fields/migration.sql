/*
  Warnings:

  - Added the required column `diagnosed` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasReferral` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientAge` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientFirstName` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientLastName` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postCode` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `returnPatient` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `streetName` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `streetNum` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wantsEval` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
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
INSERT INTO "new_Request" ("createdAt", "email", "firstName", "id", "idNumber", "isAdult", "lastName", "middleName", "phone", "whatsapp") SELECT "createdAt", "email", "firstName", "id", "idNumber", "isAdult", "lastName", "middleName", "phone", "whatsapp" FROM "Request";
DROP TABLE "Request";
ALTER TABLE "new_Request" RENAME TO "Request";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

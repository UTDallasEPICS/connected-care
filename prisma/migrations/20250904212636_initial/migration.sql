-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fName" TEXT NOT NULL,
    "mInit" TEXT,
    "lName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "whatsApp" TEXT,
    "contactPref" TEXT NOT NULL DEFAULT 'EMAIL',
    "type" TEXT
);

-- CreateTable
CREATE TABLE "NonEmployee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dob" DATETIME NOT NULL,
    "gender" TEXT NOT NULL,
    "streetName" TEXT NOT NULL,
    "streetNum" INTEGER NOT NULL,
    "buildingNum" INTEGER,
    "postCode" INTEGER NOT NULL,
    CONSTRAINT "NonEmployee_id_fkey" FOREIGN KEY ("id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "NonEmployee_postCode_fkey" FOREIGN KEY ("postCode") REFERENCES "PostCodeCity" ("postCode") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PostCodeCity" (
    "postCode" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "city" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "identification" TEXT NOT NULL,
    "diagnosed" BOOLEAN NOT NULL,
    "sponsorId" TEXT,
    CONSTRAINT "Patient_id_fkey" FOREIGN KEY ("id") REFERENCES "NonEmployee" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Patient_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "Sponsor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Specialization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER NOT NULL,
    "comment" TEXT,
    "maxAttendance" INTEGER NOT NULL DEFAULT 1,
    "typeId" TEXT NOT NULL,
    "therapistId" TEXT NOT NULL,
    CONSTRAINT "Session_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "SessionType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Session_therapistId_fkey" FOREIGN KEY ("therapistId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SessionType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "SessionPatient" (
    "sessionId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("sessionId", "patientId"),
    CONSTRAINT "SessionPatient_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SessionPatient_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MedicalRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "data" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    CONSTRAINT "MedicalRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Sponsor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "contact" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "patientId" TEXT NOT NULL,
    CONSTRAINT "Report_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReportData" (
    "reportId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    PRIMARY KEY ("reportId", "question"),
    CONSTRAINT "ReportData_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContactForm" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nationality" TEXT NOT NULL,
    "returnPatient" BOOLEAN NOT NULL,
    "wantsEval" BOOLEAN NOT NULL,
    "insurance" TEXT NOT NULL,
    "comment" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PROCESSING',
    "patientId" TEXT NOT NULL,
    CONSTRAINT "ContactForm_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_parent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_parent_A_fkey" FOREIGN KEY ("A") REFERENCES "NonEmployee" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_parent_B_fkey" FOREIGN KEY ("B") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_SpecializationToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_SpecializationToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Specialization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_SpecializationToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_whatsApp_key" ON "User"("whatsApp");

-- CreateIndex
CREATE UNIQUE INDEX "NonEmployee_id_key" ON "NonEmployee"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PostCodeCity_postCode_key" ON "PostCodeCity"("postCode");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_id_key" ON "Patient"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_identification_key" ON "Patient"("identification");

-- CreateIndex
CREATE UNIQUE INDEX "Specialization_name_key" ON "Specialization"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Session_time_therapistId_key" ON "Session"("time", "therapistId");

-- CreateIndex
CREATE UNIQUE INDEX "SessionType_name_key" ON "SessionType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ContactForm_patientId_key" ON "ContactForm"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "_parent_AB_unique" ON "_parent"("A", "B");

-- CreateIndex
CREATE INDEX "_parent_B_index" ON "_parent"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SpecializationToUser_AB_unique" ON "_SpecializationToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_SpecializationToUser_B_index" ON "_SpecializationToUser"("B");

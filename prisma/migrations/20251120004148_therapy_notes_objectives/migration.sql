-- CreateTable
CREATE TABLE "TherapyNote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patientId" TEXT NOT NULL,
    "sessionType" TEXT NOT NULL,
    "therapyType" TEXT NOT NULL,
    "otherTherapies" TEXT,
    "objectivesDate" DATETIME,
    "reinforcersUsed" TEXT,
    "reinforcersDate" DATETIME,
    "familyRecommendations" TEXT,
    "familyRecommendationsDate" DATETIME,
    "goalsAchieved" TEXT,
    "goalsAchievedDate" DATETIME,
    "progressNotes" TEXT,
    "progressNotesDate" DATETIME,
    "nextSessionObjectives" TEXT,
    "nextSessionObjectivesDate" DATETIME,
    "incidents" TEXT,
    "incidentsDate" DATETIME,
    "generalObservations" TEXT,
    "generalObservationsDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TherapyNote_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TherapyNoteObjective" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "therapyNoteId" INTEGER NOT NULL,
    "goalKey" TEXT,
    "goalLabel" TEXT NOT NULL,
    "details" TEXT,
    CONSTRAINT "TherapyNoteObjective_therapyNoteId_fkey" FOREIGN KEY ("therapyNoteId") REFERENCES "TherapyNote" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_NonEmployee" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "identification" TEXT,
    "dob" DATETIME,
    "gender" TEXT,
    "streetName" TEXT NOT NULL,
    "streetNum" INTEGER NOT NULL,
    "buildingNum" INTEGER,
    "postCode" INTEGER NOT NULL,
    CONSTRAINT "NonEmployee_postCode_fkey" FOREIGN KEY ("postCode") REFERENCES "PostCodeCity" ("postCode") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "NonEmployee_id_fkey" FOREIGN KEY ("id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_NonEmployee" ("buildingNum", "dob", "gender", "id", "identification", "postCode", "streetName", "streetNum") SELECT "buildingNum", "dob", "gender", "id", "identification", "postCode", "streetName", "streetNum" FROM "NonEmployee";
DROP TABLE "NonEmployee";
ALTER TABLE "new_NonEmployee" RENAME TO "NonEmployee";
CREATE UNIQUE INDEX "NonEmployee_id_key" ON "NonEmployee"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

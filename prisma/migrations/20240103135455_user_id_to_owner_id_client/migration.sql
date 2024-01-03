/*
  Warnings:

  - You are about to drop the column `userId` on the `Client` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Client" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ref" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT NOT NULL,
    "siren" TEXT,
    "ape" TEXT,
    "nif" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "Client_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Client" ("address", "ape", "createdAt", "email", "id", "name", "nif", "phone", "ref", "siren", "updatedAt") SELECT "address", "ape", "createdAt", "email", "id", "name", "nif", "phone", "ref", "siren", "updatedAt" FROM "Client";
DROP TABLE "Client";
ALTER TABLE "new_Client" RENAME TO "Client";
CREATE UNIQUE INDEX "Client_ref_key" ON "Client"("ref");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

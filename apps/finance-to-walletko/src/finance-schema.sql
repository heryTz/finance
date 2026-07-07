CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "name" TEXT,
  "emailVerified" BOOLEAN NOT NULL DEFAULT false,
  "image" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE "Tag" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP,
  UNIQUE ("name", "userId")
);

CREATE TABLE "Operation" (
  "id" TEXT PRIMARY KEY,
  "label" TEXT NOT NULL,
  "amount" DECIMAL(10, 2) NOT NULL,
  "type" TEXT NOT NULL,
  "userId" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP
);

CREATE TABLE "_OperationToTag" (
  "A" TEXT NOT NULL,
  "B" TEXT NOT NULL,
  UNIQUE ("A", "B")
);

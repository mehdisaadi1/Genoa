-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'Reader',
    "is_validated" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Member" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "birthDate" DATETIME,
    "deathDate" DATETIME,
    "photoUrl" TEXT,
    "professions" TEXT,
    "contact" TEXT,
    "extraInfo" TEXT,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "authorId" INTEGER,
    CONSTRAINT "Member_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Relation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "parentId" INTEGER NOT NULL,
    "childId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    CONSTRAINT "Relation_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Relation_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Couple" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "partner1Id" INTEGER NOT NULL,
    "partner2Id" INTEGER NOT NULL,
    "startDate" DATETIME,
    "endDate" DATETIME,
    CONSTRAINT "Couple_partner1Id_fkey" FOREIGN KEY ("partner1Id") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Couple_partner2Id_fkey" FOREIGN KEY ("partner2Id") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Relation_parentId_childId_key" ON "Relation"("parentId", "childId");

-- CreateIndex
CREATE UNIQUE INDEX "Couple_partner1Id_partner2Id_key" ON "Couple"("partner1Id", "partner2Id");

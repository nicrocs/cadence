-- CreateEnum
CREATE TYPE "WorkSessionType" AS ENUM ('DEEP_WORK', 'PLANNING', 'REVIEW', 'COLLABORATION');

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER NOT NULL,
    "type" "WorkSessionType" NOT NULL DEFAULT 'DEEP_WORK',
    "projectId" TEXT,
    "intention" TEXT NOT NULL,
    "accomplished" TEXT,
    "pickup" TEXT,
    "intentionMet" BOOLEAN,
    "mood" INTEGER,
    "focus" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkTag" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "WorkTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_WorkSessionToWorkTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_WorkSessionToWorkTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_userId_name_key" ON "Project"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "WorkTag_userId_name_key" ON "WorkTag"("userId", "name");

-- CreateIndex
CREATE INDEX "_WorkSessionToWorkTag_B_index" ON "_WorkSessionToWorkTag"("B");

-- AddForeignKey
ALTER TABLE "WorkSession" ADD CONSTRAINT "WorkSession_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkSessionToWorkTag" ADD CONSTRAINT "_WorkSessionToWorkTag_A_fkey" FOREIGN KEY ("A") REFERENCES "WorkSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkSessionToWorkTag" ADD CONSTRAINT "_WorkSessionToWorkTag_B_fkey" FOREIGN KEY ("B") REFERENCES "WorkTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

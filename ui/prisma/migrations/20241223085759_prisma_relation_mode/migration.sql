-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "JournalRecord" DROP CONSTRAINT "JournalRecord_doctor_id_fkey";

-- DropForeignKey
ALTER TABLE "JournalRecord" DROP CONSTRAINT "JournalRecord_patient_id_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "JournalRecord_patient_id_idx" ON "JournalRecord"("patient_id");

-- CreateIndex
CREATE INDEX "JournalRecord_doctor_id_idx" ON "JournalRecord"("doctor_id");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

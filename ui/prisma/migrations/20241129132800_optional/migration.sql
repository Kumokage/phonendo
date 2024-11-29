/*
  Warnings:

  - You are about to drop the column `patientd_id` on the `JournalRecord` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phonendo_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "JournalRecord" DROP CONSTRAINT "JournalRecord_doctor_id_fkey";

-- DropForeignKey
ALTER TABLE "JournalRecord" DROP CONSTRAINT "JournalRecord_patientd_id_fkey";

-- AlterTable
ALTER TABLE "JournalRecord" DROP COLUMN "patientd_id",
ADD COLUMN     "patient_id" TEXT,
ALTER COLUMN "doctor_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_phonendo_id_key" ON "User"("phonendo_id");

-- AddForeignKey
ALTER TABLE "JournalRecord" ADD CONSTRAINT "JournalRecord_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "User"("phonendo_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalRecord" ADD CONSTRAINT "JournalRecord_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "User"("phonendo_id") ON DELETE SET NULL ON UPDATE CASCADE;

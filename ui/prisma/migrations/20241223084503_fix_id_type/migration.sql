/*
  Warnings:

  - The `doctor_id` column on the `JournalRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `patient_id` column on the `JournalRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `phonendo_id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "JournalRecord" DROP CONSTRAINT "JournalRecord_doctor_id_fkey";

-- DropForeignKey
ALTER TABLE "JournalRecord" DROP CONSTRAINT "JournalRecord_patient_id_fkey";

-- AlterTable
ALTER TABLE "JournalRecord" DROP COLUMN "doctor_id",
ADD COLUMN     "doctor_id" INTEGER,
DROP COLUMN "patient_id",
ADD COLUMN     "patient_id" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "phonendo_id",
ADD COLUMN     "phonendo_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_phonendo_id_key" ON "User"("phonendo_id");

-- AddForeignKey
ALTER TABLE "JournalRecord" ADD CONSTRAINT "JournalRecord_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "User"("phonendo_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalRecord" ADD CONSTRAINT "JournalRecord_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "User"("phonendo_id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `name` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Status` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[status_name]` on the table `Status` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `company_name` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status_name` to the `Status` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Status_name_key";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "name",
ADD COLUMN     "company_name" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Status" DROP COLUMN "name",
ADD COLUMN     "status_name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Contact_HR" (
    "contact_id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "hr_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "position" TEXT,
    "linked_in" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contact_HR_pkey" PRIMARY KEY ("contact_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contact_HR_email_key" ON "Contact_HR"("email");

-- CreateIndex
CREATE INDEX "Contact_HR_company_id_idx" ON "Contact_HR"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "Status_status_name_key" ON "Status"("status_name");

-- AddForeignKey
ALTER TABLE "Contact_HR" ADD CONSTRAINT "Contact_HR_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("company_id") ON DELETE CASCADE ON UPDATE CASCADE;

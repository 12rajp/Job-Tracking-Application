/*
  Warnings:

  - You are about to drop the column `category` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the column `number_of_year` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Skill` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[skill_name]` on the table `Skill` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Skill" DROP CONSTRAINT "Skill_user_id_fkey";

-- DropIndex
DROP INDEX "Skill_user_id_idx";

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Skill" DROP COLUMN "category",
DROP COLUMN "number_of_year",
DROP COLUMN "user_id";

-- CreateTable
CREATE TABLE "UserSkill" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "skill_id" INTEGER NOT NULL,
    "number_of_year" INTEGER,
    "category" TEXT,

    CONSTRAINT "UserSkill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSkill_user_id_skill_id_key" ON "UserSkill"("user_id", "skill_id");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_skill_name_key" ON "Skill"("skill_name");

-- AddForeignKey
ALTER TABLE "UserSkill" ADD CONSTRAINT "UserSkill_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkill" ADD CONSTRAINT "UserSkill_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "Skill"("skill_id") ON DELETE CASCADE ON UPDATE CASCADE;

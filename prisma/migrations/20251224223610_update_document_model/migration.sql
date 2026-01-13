/*
  Warnings:

  - Changed the type of `doc_type` on the `Document` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "size" INTEGER,
ALTER COLUMN "app_id" DROP NOT NULL,
DROP COLUMN "doc_type",
ADD COLUMN     "doc_type" TEXT NOT NULL;

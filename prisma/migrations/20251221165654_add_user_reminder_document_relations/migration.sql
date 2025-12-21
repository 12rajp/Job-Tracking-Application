-- CreateEnum
CREATE TYPE "NotificationMethod" AS ENUM ('EMAIL', 'INAPP', 'BOTH');

-- CreateEnum
CREATE TYPE "InterviewType" AS ENUM ('ZOOM', 'FACE_TO_FACE');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('RESUME', 'COVER_LETTER', 'OTHER');

-- CreateTable
CREATE TABLE "Reminder" (
    "rem_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "app_id" INTEGER NOT NULL,
    "reminder_at" TIMESTAMP(3) NOT NULL,
    "message" TEXT NOT NULL,
    "is_sent" BOOLEAN NOT NULL DEFAULT false,
    "method" "NotificationMethod" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("rem_id")
);

-- CreateTable
CREATE TABLE "Interview" (
    "inter_id" SERIAL NOT NULL,
    "app_id" INTEGER NOT NULL,
    "round_num" INTEGER NOT NULL,
    "interview_at" TIMESTAMP(3) NOT NULL,
    "interview_type" "InterviewType" NOT NULL,
    "interviewer" TEXT,
    "location" TEXT,
    "duration" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("inter_id")
);

-- CreateTable
CREATE TABLE "Document" (
    "doc_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "app_id" INTEGER NOT NULL,
    "doc_name" TEXT NOT NULL,
    "doc_type" "DocumentType" NOT NULL,
    "file_path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("doc_id")
);

-- CreateIndex
CREATE INDEX "Reminder_user_id_idx" ON "Reminder"("user_id");

-- CreateIndex
CREATE INDEX "Reminder_app_id_idx" ON "Reminder"("app_id");

-- CreateIndex
CREATE INDEX "Interview_app_id_idx" ON "Interview"("app_id");

-- CreateIndex
CREATE INDEX "Document_user_id_idx" ON "Document"("user_id");

-- CreateIndex
CREATE INDEX "Document_app_id_idx" ON "Document"("app_id");

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "JobApplication"("app_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "JobApplication"("app_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_app_id_fkey" FOREIGN KEY ("app_id") REFERENCES "JobApplication"("app_id") ON DELETE CASCADE ON UPDATE CASCADE;

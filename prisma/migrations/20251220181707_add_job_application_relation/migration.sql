-- CreateTable
CREATE TABLE "JobApplication" (
    "app_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "company_id" INTEGER NOT NULL,
    "status_id" INTEGER NOT NULL,
    "position_title" TEXT NOT NULL,
    "job_description" TEXT,
    "job_link" TEXT,
    "location" TEXT,
    "job_type" TEXT NOT NULL,
    "date_applied" TIMESTAMP(3) NOT NULL,
    "application_deadline" TIMESTAMP(3),
    "salary_offered" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("app_id")
);

-- CreateTable
CREATE TABLE "Company" (
    "company_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "industry" TEXT,
    "company_size" TEXT,
    "location" TEXT,
    "rating" DOUBLE PRECISION,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("company_id")
);

-- CreateTable
CREATE TABLE "Status" (
    "status_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("status_id")
);

-- CreateIndex
CREATE INDEX "JobApplication_user_id_idx" ON "JobApplication"("user_id");

-- CreateIndex
CREATE INDEX "JobApplication_company_id_idx" ON "JobApplication"("company_id");

-- CreateIndex
CREATE INDEX "JobApplication_status_id_idx" ON "JobApplication"("status_id");

-- CreateIndex
CREATE UNIQUE INDEX "Status_name_key" ON "Status"("name");

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "Status"("status_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "CareerPreference" (
    "pref_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "pref_industry" TEXT NOT NULL,
    "pref_role" TEXT NOT NULL,
    "pref_location" TEXT,
    "min_salary" INTEGER,
    "max_salary" INTEGER,
    "work_type" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CareerPreference_pkey" PRIMARY KEY ("pref_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CareerPreference_user_id_key" ON "CareerPreference"("user_id");

-- AddForeignKey
ALTER TABLE "CareerPreference" ADD CONSTRAINT "CareerPreference_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "Skill" (
    "skill_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "skill_name" TEXT NOT NULL,
    "number_of_year" INTEGER,
    "category" TEXT,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("skill_id")
);

-- CreateIndex
CREATE INDEX "Skill_user_id_idx" ON "Skill"("user_id");

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

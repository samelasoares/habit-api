-- CreateTable
CREATE TABLE "habits" (
    "id_habit" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "habits_pkey" PRIMARY KEY ("id_habit")
);

-- CreateTable
CREATE TABLE "habit_week_days" (
    "id_habit_week_days" SERIAL NOT NULL,
    "id_habit" INTEGER NOT NULL,
    "week_day" INTEGER NOT NULL,

    CONSTRAINT "habit_week_days_pkey" PRIMARY KEY ("id_habit_week_days")
);

-- CreateTable
CREATE TABLE "day_habit" (
    "id_day_habit" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "day_habit_pkey" PRIMARY KEY ("id_day_habit")
);

-- CreateTable
CREATE TABLE "completed_habit" (
    "id_completed_habit" SERIAL NOT NULL,
    "id_habit" INTEGER NOT NULL,
    "id_day_habit" INTEGER NOT NULL,

    CONSTRAINT "completed_habit_pkey" PRIMARY KEY ("id_completed_habit")
);

-- CreateIndex
CREATE UNIQUE INDEX "habit_week_days_id_habit_week_day_key" ON "habit_week_days"("id_habit", "week_day");

-- CreateIndex
CREATE UNIQUE INDEX "completed_habit_id_habit_id_day_habit_key" ON "completed_habit"("id_habit", "id_day_habit");

-- AddForeignKey
ALTER TABLE "habit_week_days" ADD CONSTRAINT "habit_week_days_id_habit_fkey" FOREIGN KEY ("id_habit") REFERENCES "habits"("id_habit") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "completed_habit" ADD CONSTRAINT "completed_habit_id_habit_fkey" FOREIGN KEY ("id_habit") REFERENCES "habits"("id_habit") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "completed_habit" ADD CONSTRAINT "completed_habit_id_day_habit_fkey" FOREIGN KEY ("id_day_habit") REFERENCES "day_habit"("id_day_habit") ON DELETE RESTRICT ON UPDATE CASCADE;

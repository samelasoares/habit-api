import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const firstHabitId = 1;
const firstHabitCreationDate = new Date("2023-12-23T03:00:00.000");

const secondHabitId = 2;
const secondHabitCreationDate = new Date("2023-12-25T03:00:00.000");

const thirdHabitId = 3;
const thirdHabitCreationDate = new Date("2023-12-31T03:00:00.000");

async function main() {
  await prisma.habits.deleteMany();
  await prisma.day_habit.deleteMany();
  await prisma.completed_habit.deleteMany();

  await Promise.all([
    prisma.habits.create({
      data: {
        title: "Beber 2L água",
        created_at: firstHabitCreationDate,
        habit_week_days: {
          create: [{ week_day: 1 }, { week_day: 2 }, { week_day: 3 }],
        },
      },
    }),

    prisma.habits.create({
      data: {
        title: "Me exercitar",
        created_at: secondHabitCreationDate,
        habit_week_days: {
          create: [{ week_day: 3 }, { week_day: 4 }, { week_day: 5 }],
        },
      },
    }),

    prisma.habits.create({
      data: {
        title: "Dormir 8h",
        created_at: thirdHabitCreationDate,
        habit_week_days: {
          create: [
            { week_day: 1 },
            { week_day: 2 },
            { week_day: 3 },
            { week_day: 4 },
            { week_day: 5 },
          ],
        },
      },
    }),
  ]);

  await Promise.all([
    //  Habits (Complete/Available): 1/1

    prisma.day_habit.create({
      data: {
        /** Monday */
        date: new Date("2023-12-25T03:00:00.000z"),
        completed_habit: {
          create: {
            id_habit: firstHabitId,
          },
        },
      },
    }),

    // Habits (Complete/Available): 1/1

    prisma.day_habit.create({
      data: {
        /** Friday */
        date: new Date("2023-12-29T03:00:00.000z"),
        completed_habit: {
          create: {
            id_habit: firstHabitId,
          },
        },
      },
    }),

    //  Habits (Complete/Available): 2/2

    prisma.day_habit.create({
      data: {
        /** Wednesday */
        date: new Date("2023-12-27T03:00:00.000z"),
        completed_habit: {
          create: [{ id_habit: firstHabitId }, { id_habit: secondHabitId }],
        },
      },
    }),
  ]);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

const prisma = new PrismaClient();

export class Repository {
  async listAllHabits() {
    return await prisma.habits.findMany();
  }

  async detailsOfDay(date: Date) {
    const week_day = dayjs(date).get("day");

    const possibleHabits = await prisma.habits.findMany({
      where: {
        created_at: {
          lte: date,
        },
        habit_week_days: {
          some: {
            week_day,
          },
        },
      },
    });

    const completedHabits = await prisma.day_habit
      .findFirst({
        where: {
          date: date,
        },
        include: {
          completed_habit: true,
        },
      })
      .then((dayArr) =>
        dayArr?.completed_habit.map((i) => {
          return i.id_habit;
        })
      );

    return { possibleHabits, completedHabits };
  }

  async createHabit(title: string, weekDays: number[]) {
    const today = dayjs().startOf("day").toDate();

    await prisma.habits.create({
      data: {
        title,
        created_at: today,
        habit_week_days: {
          create: weekDays.map((week_day: number) => {
            return { week_day };
          }),
        },
      },
    });
  }

  async findDayHabit(date: Date) {
    return await prisma.day_habit.findFirst({
      where: {
        date: date,
      },
    });
  }

  async createDayHabit(date: Date) {
    return await prisma.day_habit.create({
      data: {
        date,
      },
    });
  }

  async findCompleteHabitTodayById(id_habit: number, id_day_habit: number) {
    return await prisma.completed_habit.findFirst({
      where: {
        id_habit,
        id_day_habit,
      },
    });
  }

  async completeHabitToday(id_habit: number, id_day_habit: number) {
    await prisma.completed_habit.create({
      data: {
        id_habit,
        id_day_habit,
      },
    });
  }

  async removeCompletedHabitToday(id_completed_habit: number) {
    await prisma.completed_habit.delete({
      where: {
        id_completed_habit,
      },
    });
  }

  async summary() {
    return await prisma.$queryRaw`
      SELECT 
        DH.id_day_habit, 
        DH.date,
        (
          SELECT 
          cast(count(*) as float)
          
          FROM completed_habit CH

          WHERE CH.id_day_habit = DH.id_day_habit
        ) as completed,
        (
          SELECT 
          cast(count(*) as float)
          
          FROM habit_week_days HWD

          JOIN habits H
            ON H.id_habit = HWD.id_habit

          WHERE
            HWD.week_day = EXTRACT(DOW FROM DH.date)
            AND H.created_at <= DH.date
        ) as amount
      FROM day_habit DH
      `;
  }
}

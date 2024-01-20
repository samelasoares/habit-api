import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { Repository } from "./repository";
import dayjs from "dayjs";

const repository = new Repository();

export class Controller {
  async listAllHabits(req: FastifyRequest, res: FastifyReply) {
    try {
      const habits = await repository.listAllHabits();

      res.status(200).send(habits);
    } catch (error) {
      console.error(error);
      throw new Error(error as string);
    }
  }

  async detailsOfDay(req: FastifyRequest, res: FastifyReply) {
    const detailsOfDayQueryVerify = z.object({
      date: z.coerce.date(),
    });

    const { date } = detailsOfDayQueryVerify.parse(req.query);

    try {
      const specificDay = await repository.detailsOfDay(date);

      res.status(200).send(specificDay);
    } catch (error) {
      console.error(error);
      throw new Error(error as string);
    }
  }

  async createHabit(req: FastifyRequest, res: FastifyReply) {
    const createHabitBodyVerify = z.object({
      title: z.coerce.string(),
      weekDays: z.array(z.number().min(0).max(6)),
    });

    const { title, weekDays } = createHabitBodyVerify.parse(req.body);

    try {
      await repository.createHabit(title, weekDays);

      res.send(200);
    } catch (error) {
      console.error(error);
      throw new Error(error as string);
    }
  }

  async toogleHabit(req: FastifyRequest, res: FastifyReply) {
    const toogleHabitParamsVerify = z.object({
      id_habit: z.coerce.number(),
    });

    const { id_habit } = toogleHabitParamsVerify.parse(req.params);
    const today = dayjs().startOf("day").toDate();

    try {
      let day = await repository.findDayHabit(today);

      if (!day) {
        day = await repository.createDayHabit(today);
      }

      const findCompleteHabitTodayById =
        await repository.findCompleteHabitTodayById(id_habit, day.id_day_habit);

      if (findCompleteHabitTodayById) {
        await repository.removeCompletedHabitToday(
          findCompleteHabitTodayById.id_completed_habit
        );
        res.status(200).send("Removed successfully");
      } else {
        await repository.completeHabitToday(id_habit, day.id_day_habit);
        res.status(201).send("Completed successfully");
      }
    } catch (error) {
      console.error(error);
      throw new Error(error as string);
    }
  }

  async summary(req: FastifyRequest, res: FastifyReply) {
    try {
      const summary = await repository.summary();
      res.status(200).send(summary);
    } catch (error) {
      console.error(error);
      throw new Error(error as string);
    }
  }
}

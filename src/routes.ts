import { PrismaClient } from "@prisma/client";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { Controller } from "./controller";

const controller = new Controller();

export async function Routes(app: FastifyInstance) {
  app.get("/", controller.listAllHabits);
  app.get("/day", controller.detailsOfDay);
  app.get("/summary", controller.summary);

  app.patch("/habits/:id_habit/toogle", controller.toogleHabit);

  app.post("/create", controller.createHabit);
}

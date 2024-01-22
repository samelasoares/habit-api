import cors from "@fastify/cors";
import fastify from "fastify";
import { Routes } from "./routes";
import dotenv from 'dotenv';
import { env } from "./env";

const app = fastify();

dotenv.config();

app.register(cors);
app.register(Routes);

app.listen({ port: env.PORT, host: env.HOST}).then(() => {
  console.log(`Rodando em ${env.HOST}:${env.PORT} 🚀`);
});

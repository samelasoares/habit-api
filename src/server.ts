import cors from "@fastify/cors";
import fastify from "fastify";
import { Routes } from "./routes";

const app = fastify();

app.register(cors);
app.register(Routes);

app.listen({ port: 3333, host: "192.168.1.105"}).then(() => {
  console.log("Rodando em localhost:3333 🚀");
});

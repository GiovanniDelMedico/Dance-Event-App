import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";
import eventsRouter from "./modules/events/events.router";
import usersRouter from "./modules/users/users.router";
import messagesRouter from "./modules/messages/messages.router";

export const createApp = () => {
  const app = express();

  // Parser JSON — deve essere PRIMA delle route
  app.use(express.json());

  // CORS
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );

  // ROUTES
  app.use("/events", eventsRouter);
  app.use("/users", usersRouter);
  app.use("/messages", messagesRouter);

  // ROOT
  app.get("/", (req, res) => {
    res.send("Server attivo!");
  });

  // ERROR HANDLER
  app.use(errorHandler);

  return app;
};

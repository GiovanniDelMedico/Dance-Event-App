import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";
import eventsRouter from "./modules/events/events.router";
import usersRouter from "./modules/users/users.router";
// messagesRouter lo lasciamo ma non lo useremo finché non creiamo il modulo
// import messagesRouter from "./modules/messages/messages.router";

export const createApp = () => {
  const app = express();

  // Middleware globali
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );

  app.use(express.json());

  // Rotte dei moduli
  app.use("/events", eventsRouter);
  app.use("/users", usersRouter);
  // app.use("/messages", messagesRouter);

  // Rotta base
  app.get("/", (req, res) => {
    res.send("Server attivo!");
  });

  // Error handler globale (DEVE essere l’ultimo)
  app.use(errorHandler);

  return app;
};

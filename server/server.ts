import "dotenv/config";

import express from "express";
import cors from "cors";

import authRoutes from "./src/routes/auth";
import eventsRoutes from "./src/routes/events";

console.log(">>> QUESTO È server.ts <<<");

const app = express();
const PORT = 3000;

// Middleware globali
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// Montiamo i router
app.use("/auth", authRoutes);
app.use("/events", eventsRoutes);

// Rotta base
app.get("/", (req, res) => {
  res.send("Server attivo!");
});

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});

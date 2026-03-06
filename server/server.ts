import express from "express";
import { events } from "./data/events.js";



const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Server attivo!");
});
app.get("/events", (req, res) => {
  res.json(events);
});

app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});

import express from "express";
import { events } from "./data/events.js";
import type { Event } from "./types/Event.js";


const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server attivo!");
});


app.get("/events",(req,res)=>{
  const{city,category,date} = req.query;
  let filtered =events;
  if(city){
    filtered= filtered.filter(e=>e.city.toLowerCase() === String(city).toLowerCase());
  }
  if(category){
    filtered= filtered.filter(e=>e.category.toLowerCase() === String(category).toLowerCase());
  }
  if (date) {
    filtered = filtered.filter(e => e.date === date);
  }
  res.json(filtered);
});

app.get("/events/:id",(req,res)=>{
  const id = Number(req.params.id);
  const event = events.find(e => e.id === id);

  if(!event){
    return res.status(404).json({error:"Evento non trovato"});
  }
  res.json(event);
});

app.post("/events", (req, res) => {
  const { title, date, city, category, description, image } = req.body;

  if (!title || !date || !city || !category || !description || !image) {
    return res.status(400).json({ error: "Tutti i campi sono obbligatori" });
  }

  const newId = events.length > 0 ? events[events.length - 1].id + 1 : 1;

  const newEvent: Event = {
    id: newId,
    title,
    date,
    city,
    category,
    description,
    image
  };

  events.push(newEvent);

  res.status(201).json(newEvent);
});


app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});

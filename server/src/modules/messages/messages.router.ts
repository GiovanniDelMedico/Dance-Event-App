import { Router } from "express";
import { auth } from "../../middleware/auth";
import { createConversation,getConversations,getMessages,sendMessage,markAsReadController } from "./messages.controller";

const router = Router();
console.log("🔥 MESSAGES ROUTE CARICATO");
// Crea una conversazione tra creator e iscritto
router.post("/", auth, createConversation);

// Lista tutte le conversazioni dell’utente loggato
router.get("/", auth, getConversations);

// Ottiene i messaggi di una conversazione
router.get("/:id/messages", auth, getMessages);

// Invia un messaggio in una conversazione
router.post("/:id/messages", auth, sendMessage);

// 🔥 SEGNA COME LETTI I MESSAGGI DI UNA CONVERSAZIONE
router.patch("/:id/read", auth, markAsReadController);

export default router;

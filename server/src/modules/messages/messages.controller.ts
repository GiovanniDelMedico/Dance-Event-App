import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import { createConversationService,getConversationsService,getMessagesService,sendMessageService } from "./messages.service";

// --------------------------------------------------
// CREA UNA CONVERSAZIONE
// --------------------------------------------------
export async function createConversation(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const { participantId, eventId } = req.body;

    const conversation = await createConversationService({
      userId,
      participantId,
      eventId,
    });

    res.json(conversation);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
}

// --------------------------------------------------
// LISTA CONVERSAZIONI UTENTE
// --------------------------------------------------
export async function getConversations(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;

    const conversations = await getConversationsService(userId);

    res.json(conversations);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
}

// --------------------------------------------------
// OTTIENE I MESSAGGI DI UNA CONVERSAZIONE
// --------------------------------------------------
export async function getMessages(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const conversationId = Number(req.params.id);

    const messages = await getMessagesService(conversationId, userId);

    res.json(messages);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
}

// --------------------------------------------------
// INVIA UN MESSAGGIO
// --------------------------------------------------
export async function sendMessage(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const conversationId = Number(req.params.id);
    const { content } = req.body;

    const message = await sendMessageService({
      conversationId,
      senderId: userId,
      content,
    });

    res.json(message);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
}
// --------------------------------------------------
// SEGNA COME LETTI I MESSAGGI DI UNA CONVERSAZIONE
// --------------------------------------------------
import { markConversationAsReadService } from "./messages.service";

export async function markAsReadController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;
    const conversationId = Number(req.params.id);

    const result = await markConversationAsReadService(conversationId, userId);

    res.json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
}

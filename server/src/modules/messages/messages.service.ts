import { prisma } from "../../lib/prisma";

// --------------------------------------------------
// CREA UNA CONVERSAZIONE (se non esiste già)
// --------------------------------------------------
export async function createConversationService({
  userId,
  participantId,
  eventId,
}: {
  userId: number;
  participantId: number;
  eventId?: number;
}) {
  if (userId === participantId) {
    const err: any = new Error("Non puoi creare una conversazione con te stesso");
    err.status = 400;
    throw err;
  }

  // 🔥 Cerca una conversazione ESISTENTE tra i due utenti (indipendente dall'evento)
  const existing = await prisma.conversation.findFirst({
    where: {
      OR: [
        { creatorId: userId, participantId },
        { creatorId: participantId, participantId: userId },
      ],
    },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        include: { sender: true },
      },
    },
  });

  if (existing) return existing;

  // 🔥 Crea nuova conversazione (eventId è solo un metadato)
  return prisma.conversation.create({
    data: {
      creatorId: userId,
      participantId,
      eventId: eventId ?? null,
    },
  });
}

// --------------------------------------------------
// LISTA CONVERSAZIONI UTENTE
// --------------------------------------------------
export async function getConversationsService(userId: number) {
  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [
        { creatorId: userId },
        { participantId: userId }
      ],
    },
    include: {
      creator: {
        select: { id: true, nickname: true, avatarUrl: true },
      },
      participant: {
        select: { id: true, nickname: true, avatarUrl: true },
      },
      messages: {
        take: 1,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          content: true,
          createdAt: true,
          readAt: true,
          sender: { select: { id: true, nickname: true } },
        },
      },
    },
  });

  // 🔥 Ordina manualmente per ultimo messaggio
  conversations.sort((a, b) => {
    const aDate = a.messages[0]?.createdAt
      ? new Date(a.messages[0].createdAt).getTime()
      : 0;

    const bDate = b.messages[0]?.createdAt
      ? new Date(b.messages[0].createdAt).getTime()
      : 0;

    return bDate - aDate;
  });

  // 🔥 Aggiunge otherUser per la UI + hasUnread corretto
  return conversations.map((conv) => {
    const otherUser =
      conv.creatorId === userId ? conv.participant : conv.creator;

    const lastMessage = conv.messages[0];

    const hasUnread =
      lastMessage &&
      lastMessage.sender.id !== userId &&
      lastMessage.readAt === null;

    return {
      ...conv,
      otherUser,
      hasUnread,
    };
  });
}

// --------------------------------------------------
// OTTIENE I MESSAGGI DI UNA CONVERSAZIONE
// --------------------------------------------------
export async function getMessagesService(
  conversationId: number,
  userId: number
) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) {
    const err: any = new Error("Conversazione non trovata");
    err.status = 404;
    throw err;
  }

  if (conversation.creatorId !== userId && conversation.participantId !== userId) {
    const err: any = new Error("Accesso non autorizzato");
    err.status = 403;
    throw err;
  }

  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      content: true,
      createdAt: true,
      readAt: true,
      sender: { select: { id: true, nickname: true, avatarUrl: true } },
    },
  });
}

// --------------------------------------------------
// INVIA UN MESSAGGIO
// --------------------------------------------------
export async function sendMessageService({
  conversationId,
  senderId,
  content,
}: {
  conversationId: number;
  senderId: number;
  content: string;
}) {
  if (!content || content.trim() === "") {
    const err: any = new Error("Il messaggio non può essere vuoto");
    err.status = 400;
    throw err;
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) {
    const err: any = new Error("Conversazione non trovata");
    err.status = 404;
    throw err;
  }

  if (conversation.creatorId !== senderId && conversation.participantId !== senderId) {
    const err: any = new Error("Accesso non autorizzato");
    err.status = 403;
    throw err;
  }

  return prisma.message.create({
    data: {
      conversationId,
      senderId,
      content,
    },
    include: {
      sender: { select: { id: true, nickname: true } },
    },
  });
}

// --------------------------------------------------
// SEGNA COME LETTI I MESSAGGI DI UNA CONVERSAZIONE
// --------------------------------------------------
export async function markConversationAsReadService(
  conversationId: number,
  userId: number
) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) {
    const err: any = new Error("Conversazione non trovata");
    err.status = 404;
    throw err;
  }

  if (conversation.creatorId !== userId && conversation.participantId !== userId) {
    const err: any = new Error("Accesso non autorizzato");
    err.status = 403;
    throw err;
  }

  await prisma.message.updateMany({
    where: {
      conversationId,
      senderId: { not: userId },
      readAt: null,
    },
    data: {
      readAt: new Date(),
    },
  });

  return { success: true };
}

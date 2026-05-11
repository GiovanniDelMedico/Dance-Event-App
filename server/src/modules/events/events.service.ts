import { prisma } from "../../lib/prisma";
import { supabase } from "../../lib/supabase";
import { AuthUser } from "../../middleware/auth";

// --------------------------------------------------
// GET /events
// --------------------------------------------------
export async function getEvents(query: any) {
  const { region, city, category, startDate, endDate, eventType } = query;

  return prisma.event.findMany({
    where: {
      // Mostra eventi futuri o filtrati per range
      startDate: startDate ? { gte: new Date(startDate) } : undefined,
      endDate: endDate ? { lte: new Date(endDate) } : undefined,

      region: region ? { contains: region, mode: "insensitive" } : undefined,
      city: city ? { contains: city, mode: "insensitive" } : undefined,
      category: category ? { contains: category, mode: "insensitive" } : undefined,
      eventTypes: eventType ? { has: eventType } : undefined,
    },
    orderBy: { startDate: "asc" },
    include: {
      creator: {
        select: {
          id: true,
          nickname: true,
          avatarUrl: true,
        },
      },
    },
  });
}

// --------------------------------------------------
// GET /events/:id
// --------------------------------------------------
export async function getEventById(id: number) {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      creator: {
        select: {
          id: true,
          nickname: true,
          avatarUrl: true,
        },
      },
    },
  });

  if (!event) {
    const err: any = new Error("Evento non trovato");
    err.status = 404;
    throw err;
  }

  return event;
}

// --------------------------------------------------
// POST /events
// --------------------------------------------------
export async function createEvent(userId: number, body: any) {
  const start = new Date(body.startDate);
  const end = new Date(body.endDate);

  if (start < new Date()) {
    const err: any = new Error("La data di inizio deve essere futura");
    err.status = 400;
    throw err;
  }

  if (end < start) {
    const err: any = new Error("La data di fine non può essere prima della data di inizio");
    err.status = 400;
    throw err;
  }

  if (!Array.isArray(body.eventTypes) || body.eventTypes.length === 0) {
    const err: any = new Error("Devi selezionare almeno una tipologia di evento");
    err.status = 400;
    throw err;
  }

  return prisma.event.create({
    data: {
      title: body.title,
      description: body.description,
      startDate: start,
      endDate: end,
      region: body.region,
      city: body.city,
      category: body.category,
      image: body.image ?? null,
      eventTypes: body.eventTypes,
      creatorId: userId,
    },
  });
}

// --------------------------------------------------
// PUT /events/:id
// --------------------------------------------------
export async function updateEvent(id: number, user: AuthUser, body: any) {
  const existing = await prisma.event.findUnique({ where: { id } });

  if (!existing) {
    const err: any = new Error("Evento non trovato");
    err.status = 404;
    throw err;
  }

  if (existing.creatorId !== user.id && user.role !== "admin") {
    const err: any = new Error("Non hai i permessi");
    err.status = 403;
    throw err;
  }

  // Validazioni date
  if (body.startDate) {
    const start = new Date(body.startDate);
    if (start < new Date()) {
      const err: any = new Error("La data di inizio deve essere futura");
      err.status = 400;
      throw err;
    }
  }

  if (body.endDate) {
    const end = new Date(body.endDate);
    const start = body.startDate ? new Date(body.startDate) : existing.startDate;

    if (end < start) {
      const err: any = new Error("La data di fine non può essere prima della data di inizio");
      err.status = 400;
      throw err;
    }
  }

  if (body.eventTypes && !Array.isArray(body.eventTypes)) {
    const err: any = new Error("eventTypes deve essere un array di stringhe");
    err.status = 400;
    throw err;
  }

  return prisma.event.update({
    where: { id },
    data: {
      title: body.title ?? undefined,
      description: body.description ?? undefined,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      region: body.region ?? undefined,
      city: body.city ?? undefined,
      category: body.category ?? undefined,
      image: body.image ?? undefined,
      eventTypes: body.eventTypes ?? undefined,
    },
  });
}

// --------------------------------------------------
// DELETE /events/:id
// --------------------------------------------------
export async function deleteEvent(id: number, user: AuthUser) {
  const existing = await prisma.event.findUnique({ where: { id } });

  if (!existing) {
    const err: any = new Error("Evento non trovato");
    err.status = 404;
    throw err;
  }

  if (existing.creatorId !== user.id && user.role !== "admin") {
    const err: any = new Error("Non hai i permessi");
    err.status = 403;
    throw err;
  }

  await prisma.event.delete({ where: { id } });

  return { success: true };
}

// --------------------------------------------------
// POST /events/:id/register
// --------------------------------------------------
export async function registerToEvent(eventId: number, userId: number) {
  const event = await prisma.event.findUnique({ where: { id: eventId } });

  if (!event) {
    const err: any = new Error("Evento non trovato");
    err.status = 404;
    throw err;
  }

  const existing = await prisma.eventRegistration.findFirst({
    where: { eventId, userId },
  });

  if (existing) {
    const err: any = new Error("Utente già iscritto all'evento");
    err.status = 400;
    throw err;
  }

  const registration = await prisma.eventRegistration.create({
    data: { eventId, userId },
  });

  return {
    message: "Iscrizione completata",
    registration,
  };
}

// --------------------------------------------------
// DELETE /events/:id/register
// --------------------------------------------------
export async function unregisterFromEvent(eventId: number, userId: number) {
  const existing = await prisma.eventRegistration.findFirst({
    where: { eventId, userId },
  });

  if (!existing) {
    const err: any = new Error("Non sei iscritto a questo evento");
    err.status = 400;
    throw err;
  }

  await prisma.eventRegistration.delete({
    where: { id: existing.id },
  });

  return { message: "Disiscrizione completata" };
}

// --------------------------------------------------
// GET /events/:id/registrations
// --------------------------------------------------
export async function getRegistrations(eventId: number, user: AuthUser) {
  const event = await prisma.event.findUnique({ where: { id: eventId } });

  if (!event) {
    const err: any = new Error("Evento non trovato");
    err.status = 404;
    throw err;
  }

  if (event.creatorId !== user.id && user.role !== "admin") {
    const err: any = new Error("Non hai i permessi per vedere gli iscritti");
    err.status = 403;
    throw err;
  }

  const registrations = await prisma.eventRegistration.findMany({
    where: { eventId },
    include: {
      user: {
        select: { id: true, nickname: true, avatarUrl: true },
      },
    },
  });

  return {
    eventId,
    count: registrations.length,
    registrations,
  };
}

// --------------------------------------------------
// GET /events/:id/is-registered
// --------------------------------------------------
export async function checkIsRegistered(eventId: number, userId: number) {
  const registration = await prisma.eventRegistration.findFirst({
    where: { eventId, userId },
  });

  return { isRegistered: !!registration };
}

// --------------------------------------------------
// POST /events/upload
// --------------------------------------------------
export async function uploadImage(file: Express.Multer.File | undefined) {
  if (!file) {
    const err: any = new Error("Nessun file caricato");
    err.status = 400;
    throw err;
  }

  const fileExt = file.originalname.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("event-image")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    const err: any = new Error("Errore upload immagine");
    err.status = 500;
    throw err;
  }

  const publicUrl = supabase.storage
    .from("event-image")
    .getPublicUrl(fileName).data.publicUrl;

  return { url: publicUrl };
}

import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import type { CreateEventBody, UpdateEventBody } from "../types/api";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

/* -------------------------------------------
   GET /events  (pubblica)
-------------------------------------------- */
router.get(
  "/",
  async (
    req: Request<
      {},
      {},
      {},
      { city?: string; category?: string; date?: string }
    >,
    res: Response,
  ) => {
    try {
      const { city, category, date } = req.query;

      const events = await prisma.event.findMany({
        where: {
          city: city
            ? {
                contains: city,
                mode: "insensitive",
              }
            : undefined,

          category: category
            ? {
                contains: category,
                mode: "insensitive",
              }
            : undefined,

          date: date ? { gte: new Date(date) } : undefined,
        },
        include: { creator: true },
      });

      res.json(events);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Errore nel recupero degli eventi" });
    }
  },
);

/* -------------------------------------------
   GET /events/:id  (pubblica)
-------------------------------------------- */
router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = Number(req.params.id);

    const event = await prisma.event.findUnique({
      where: { id },
      include: { creator: true },
    });

    if (!event) {
      return res.status(404).json({ error: "Evento non trovato" });
    }

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore nel recupero dell'evento" });
  }
});

/* -------------------------------------------
   POST /events  (protetta)
-------------------------------------------- */
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const body = req.body as CreateEventBody;

    const newEvent = await prisma.event.create({
      data: {
        title: body.title,
        description: body.description,
        date: new Date(body.date),
        city: body.city,
        category: body.category,
        image: body.image,
        creatorId: userId,
      },
    });

    res.status(201).json(newEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore nella creazione dell'evento" });
  }
});

/* -------------------------------------------
   PUT /events/:id  (protetta)
-------------------------------------------- */
router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user!.id;
    const body = req.body as UpdateEventBody;

    const existing = await prisma.event.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ error: "Evento non trovato" });
    }

    if (existing.creatorId !== userId && req.user!.role !== "admin") {
      return res.status(403).json({ error: "Non hai i permessi" });
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        date: body.date ? new Date(body.date) : undefined,
        city: body.city,
        category: body.category,
        image: body.image,
      },
    });

    res.json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore nell'aggiornamento dell'evento" });
  }
});

/* -------------------------------------------
   DELETE /events/:id  (protetta)
-------------------------------------------- */
router.delete(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const id = Number(req.params.id);
      const userId = req.user!.id;

      const existing = await prisma.event.findUnique({ where: { id } });

      if (!existing) {
        return res.status(404).json({ error: "Evento non trovato" });
      }

      if (existing.creatorId !== userId && req.user!.role !== "admin") {
        return res.status(403).json({ error: "Non hai i permessi" });
      }

      await prisma.event.delete({ where: { id } });

      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Errore nell'eliminazione dell'evento" });
    }
  },
);



export default router;

// import { Router, Request, Response } from "express";
// import { prisma } from "../lib/prisma";
// import type { CreateEventBody, UpdateEventBody } from "../types/api";
// import { authMiddleware, AuthRequest } from "../middleware/auth";
// import { upload } from '../middleware/upload';
// import { supabase } from '../lib/supabase';

// const router = Router();

// /* -------------------------------------------
//    GET /events  (pubblica)
// -------------------------------------------- */
// router.get(
//   "/",
//   async (
//     req: Request<
//       {},
//       {},
//       {},
//       { 
//         region?: string; 
//         city?: string; 
//         category?: string; 
//         date?: string;
//         eventType?: string; // 🆕 filtro tipologia
//       }
//     >,
//     res: Response,
//   ) => {
//     try {
//       const { region, city, category, date, eventType } = req.query;

//       const events = await prisma.event.findMany({
//         where: {
//           // 🟩 Mostra solo eventi futuri
//           date: {
//             gte: date ? new Date(date) : new Date(),
//           },

//           // 🟦 Filtro regione
//           region: region
//             ? {
//                 contains: region,
//                 mode: "insensitive",
//               }
//             : undefined,

//           // 🟦 Filtro città
//           city: city
//             ? {
//                 contains: city,
//                 mode: "insensitive",
//               }
//             : undefined,

//           // 🟦 Filtro categoria
//           category: category
//             ? {
//                 contains: category,
//                 mode: "insensitive",
//               }
//             : undefined,

//           // 🟪 Filtro tipologia evento (array)
//           eventTypes: eventType
//             ? {
//                 has: eventType, // cerca eventi che contengono quella tipologia
//               }
//             : undefined,
//         },

//         // 🟩 Ordina per data crescente
//         orderBy: {
//           date: "asc",
//         },

//         include: { creator: true },
//       });

//       res.json(events);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Errore nel recupero degli eventi" });
//     }
//   },
// );


// /* -------------------------------------------
//    GET /events/:id  (pubblica)
// -------------------------------------------- */
// router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
//   try {
//     const id = Number(req.params.id);

//     const event = await prisma.event.findUnique({
//       where: { id },
//       include: { creator: true },
//     });

//     if (!event) {
//       return res.status(404).json({ error: "Evento non trovato" });
//     }

//     res.json(event);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Errore nel recupero dell'evento" });
//   }
// });

// /* -------------------------------------------
//    POST /events  (protetta)
// -------------------------------------------- */
// router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
//   try {
//     const userId = req.user!.id;
//     const body = req.body as CreateEventBody;

//     // 🛑 BLOCCO EVENTI PASSATI
//     if (new Date(body.date) < new Date()) {
//       return res.status(400).json({ error: "La data dell'evento deve essere futura" });
//     }

//     // 🛑 VALIDAZIONE TIPI DI EVENTO
//     if (!Array.isArray(body.eventTypes) || body.eventTypes.length === 0) {
//       return res.status(400).json({ error: "Devi selezionare almeno una tipologia di evento" });
//     }

//     const newEvent = await prisma.event.create({
//       data: {
//         title: body.title,
//         description: body.description,
//         date: new Date(body.date),
//         region: body.region,
//         city: body.city,
//         category: body.category,
//         image: body.image,
//         eventTypes: body.eventTypes, // 🆕 ARRAY DI STRINGHE
//         creatorId: userId,
//       },
//     });

//     res.status(201).json(newEvent);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Errore nella creazione dell'evento" });
//   }
// });


// /* -------------------------------------------
//    PUT /events/:id  (protetta)
// -------------------------------------------- */
// router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
//   try {
//     const id = Number(req.params.id);
//     const userId = req.user!.id;
//     const body = req.body as UpdateEventBody;

//     const existing = await prisma.event.findUnique({ where: { id } });

//     if (!existing) {
//       return res.status(404).json({ error: "Evento non trovato" });
//     }

//     if (existing.creatorId !== userId && req.user!.role !== "admin") {
//       return res.status(403).json({ error: "Non hai i permessi" });
//     }

//     // 🛑 BLOCCO EVENTI PASSATI (solo se la data viene aggiornata)
//     if (body.date && new Date(body.date) < new Date()) {
//       return res.status(400).json({ error: "La data dell'evento deve essere futura" });
//     }

//     // 🛑 VALIDAZIONE TIPI DI EVENTO (solo se viene passato)
//     if (body.eventTypes && !Array.isArray(body.eventTypes)) {
//       return res.status(400).json({ error: "eventTypes deve essere un array di stringhe" });
//     }

//     const updatedEvent = await prisma.event.update({
//       where: { id },
//       data: {
//         title: body.title,
//         description: body.description,
//         date: body.date ? new Date(body.date) : undefined,
//         region: body.region ?? undefined,
//         city: body.city ?? undefined,
//         category: body.category ?? undefined,
//         image: body.image ?? undefined,
//         eventTypes: body.eventTypes ?? undefined, // 🆕 ARRAY DI STRINGHE
//       },
//     });

//     res.json(updatedEvent);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Errore nell'aggiornamento dell'evento" });
//   }
// });


// /* -------------------------------------------
//    DELETE /events/:id  (protetta)
// -------------------------------------------- */
// router.delete(
//   "/:id",
//   authMiddleware,
//   async (req: AuthRequest, res: Response) => {
//     try {
//       const id = Number(req.params.id);
//       const userId = req.user!.id;

//       const existing = await prisma.event.findUnique({ where: { id } });

//       if (!existing) {
//         return res.status(404).json({ error: "Evento non trovato" });
//       }

//       if (existing.creatorId !== userId && req.user!.role !== "admin") {
//         return res.status(403).json({ error: "Non hai i permessi" });
//       }

//       await prisma.event.delete({ where: { id } });

//       res.json({ success: true });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Errore nell'eliminazione dell'evento" });
//     }
//   },
// );

// // POST /events/:id/register
// router.post("/:id/register", authMiddleware, async (req: AuthRequest, res) => {
//   try {
//     const eventId = Number(req.params.id);
//     const userId = req.user!.id;

//     // 1. Controllo se l'evento esiste
//     const event = await prisma.event.findUnique({ where: { id: eventId } });
//     if (!event) {
//       return res.status(404).json({ error: "Evento non trovato" });
//     }

//     // 2. Controllo se l'utente è già iscritto
//     const existing = await prisma.eventRegistration.findFirst({
//       where: { eventId, userId },
//     });

//     if (existing) {
//       return res.status(400).json({ error: "Utente già iscritto all'evento" });
//     }

//     // 3. Creo la registrazione
//     const registration = await prisma.eventRegistration.create({
//       data: {
//         eventId,
//         userId,
//       },
//     });

//     res.status(201).json({
//       message: "Iscrizione completata",
//       registration,
//     });
//   } catch (error) {
//     console.error("ERRORE REGISTRAZIONE EVENTO:", error);
//     res.status(500).json({ error: "Errore durante l'iscrizione" });
//   }
// });

// router.get("/:id/registrations", authMiddleware, async (req: AuthRequest, res) => {
//   try {
//     const eventId = Number(req.params.id);

//     const event = await prisma.event.findUnique({
//       where: { id: eventId },
//     });

//     if (!event) {
//       return res.status(404).json({ error: "Evento non trovato" });
//     }

//     // PERMESSI: solo creatore o admin
//     if (event.creatorId !== req.user!.id && req.user!.role !== "admin") {
//       return res.status(403).json({ error: "Non hai i permessi per vedere gli iscritti" });
//     }

//     const registrations = await prisma.eventRegistration.findMany({
//       where: { eventId },
//       include: {
//         user: {
//           select: { id: true, name: true, email: true },
//         },
//       },
//     });

//     res.json({
//       eventId,
//       count: registrations.length,
//       registrations,
//     });
//   } catch (error) {
//     console.error("ERRORE GET REGISTRATIONS:", error);
//     res.status(500).json({ error: "Errore nel recupero degli iscritti" });
//   }
// });

// // DELETE /events/:id/register
// router.delete("/:id/register", authMiddleware, async (req: AuthRequest, res) => {
//   try {
//     const eventId = Number(req.params.id);
//     const userId = req.user!.id;

//     // 1. Controllo se l'utente è iscritto
//     const existing = await prisma.eventRegistration.findFirst({
//       where: { eventId, userId },
//     });

//     if (!existing) {
//       return res.status(400).json({ error: "Non sei iscritto a questo evento" });
//     }

//     // 2. Cancello la registrazione
//     await prisma.eventRegistration.delete({
//       where: { id: existing.id },
//     });

//     res.json({ message: "Disiscrizione completata" });
//   } catch (error) {
//     console.error("ERRORE DISISCRIZIONE EVENTO:", error);
//     res.status(500).json({ error: "Errore durante la disiscrizione" });
//   }
// });

// // Route per caricare immagine
// router.post(
//   '/upload',
//   authMiddleware,
//   upload.single('image'),
//   async (req, res) => {
//     try {
//       if (!req.file) {
//         return res.status(400).json({ error: 'Nessun file caricato' });
//       }

//       const file = req.file;
//       const fileExt = file.originalname.split('.').pop();
//       const fileName = `${Date.now()}.${fileExt}`;

//       const { data, error } = await supabase.storage
//         .from('event-image')
//         .upload(fileName, file.buffer, {
//           contentType: file.mimetype,
//           upsert: false
//         });

//       if (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'Errore upload immagine' });
//       }

//       const publicUrl = supabase.storage
//         .from('event-image')
//         .getPublicUrl(fileName).data.publicUrl;

//       return res.json({ url: publicUrl });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Errore server' });
//     }
//   }
// );

// router.get("/:id/is-registered", authMiddleware, async (req: AuthRequest, res) => {
//   try {
//     const eventId = Number(req.params.id);
//     const userId = req.user!.id;

//     const registration = await prisma.eventRegistration.findFirst({
//       where: { eventId, userId }
//     });

//     res.json({ isRegistered: !!registration });
//   } catch (error) {
//     console.error("ERRORE CHECK IS REGISTERED:", error);
//     res.status(500).json({ error: "Errore nel controllo iscrizione" });
//   }
// });




// export default router;

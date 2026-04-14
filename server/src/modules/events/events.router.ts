import { Router } from "express";
import { auth } from "../../middleware/auth";
import * as eventsController from "./events.controller";
import { upload } from "../../middleware/upload";

const router = Router();

// GET /events
router.get("/", eventsController.getEvents);

// GET /events/:id
router.get("/:id", eventsController.getEventById);

// GET /events/:id/is-registered
router.get("/:id/is-registered", auth, eventsController.checkIsRegistered);

// GET /events/:id/registrations
router.get("/:id/registrations", auth, eventsController.getRegistrations);

// POST /events
router.post("/", auth, eventsController.createEvent);

// PUT /events/:id
router.put("/:id", auth, eventsController.updateEvent);

// DELETE /events/:id
router.delete("/:id", auth, eventsController.deleteEvent);

// POST /events/:id/register
router.post("/:id/register", auth, eventsController.registerToEvent);

// DELETE /events/:id/register
router.delete("/:id/register", auth, eventsController.unregisterFromEvent);

// POST /events/upload
router.post("/upload", auth, upload.single("image"), eventsController.uploadImage);


export default router;

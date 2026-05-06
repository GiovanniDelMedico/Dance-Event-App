import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth";
import * as eventsService from "./events.service";

// GET /events
export async function getEvents(req: Request, res: Response, next: NextFunction) {
  try {
    const events = await eventsService.getEvents(req.query);
    res.json(events);
  } catch (err) {
    next(err);
  }
}

// GET /events/:id
export async function getEventById(req: Request, res: Response, next: NextFunction) {
  try {
    const event = await eventsService.getEventById(Number(req.params.id));
    res.json(event);
  } catch (err) {
    next(err);
  }
}

// POST /events
export async function createEvent(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const event = await eventsService.createEvent(req.user!.id, req.body);
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
}

// PUT /events/:id
export async function updateEvent(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const updated = await eventsService.updateEvent(
      Number(req.params.id),
      req.user!,
      req.body
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// DELETE /events/:id
export async function deleteEvent(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const deleted = await eventsService.deleteEvent(Number(req.params.id), req.user!);
    res.json(deleted);
  } catch (err) {
    next(err);
  }
}

// POST /events/:id/register
export async function registerToEvent(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await eventsService.registerToEvent(
      Number(req.params.id),
      req.user!.id
    );
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

// DELETE /events/:id/register
export async function unregisterFromEvent(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await eventsService.unregisterFromEvent(
      Number(req.params.id),
      req.user!.id
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// GET /events/:id/registrations
export async function getRegistrations(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await eventsService.getRegistrations(
      Number(req.params.id),
      req.user!
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// GET /events/:id/is-registered
export async function checkIsRegistered(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await eventsService.checkIsRegistered(
      Number(req.params.id),
      req.user!.id
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// POST /events/upload
export async function uploadImage(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await eventsService.uploadImage(req.file);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
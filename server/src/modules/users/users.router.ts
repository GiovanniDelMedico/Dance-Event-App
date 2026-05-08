import { Router } from "express";
import * as usersController from "./users.controller";
import { auth } from "../../middleware/auth";
import { upload } from "../../middleware/upload";

const router = Router();

// REGISTER
router.post("/register", usersController.register);

// LOGIN
router.post("/login", usersController.login);

// UPLOAD AVATAR
router.post(
  "/avatar",
  auth,
  upload.single("avatar"),
  usersController.uploadAvatar
);

// EVENTI A CUI L'UTENTE È ISCRITTO
router.get("/me/registered-events", auth, usersController.getRegisteredEvents);

// 👇 **DEVE ESSERE L’ULTIMA ROUTE DINAMICA**
// GET /users/:id  → usata dalla chat per recuperare nickname + avatar
router.get("/:id", auth, usersController.getUserById);

export default router;

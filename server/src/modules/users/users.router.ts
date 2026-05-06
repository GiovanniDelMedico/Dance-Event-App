import { Router } from "express";
import * as usersController from "./users.controller";
import { auth } from "../../middleware/auth";
import { upload } from "../../middleware/upload";

const router = Router();

// REGISTER
router.post("/register", usersController.register);

// LOGIN
router.post("/login", usersController.login);

// UPLOAD AVATAR (nuovo)
router.post(
  "/avatar",
  auth,
  upload.single("avatar"),
  usersController.uploadAvatar
);

router.get("/me/registered-events", auth, usersController.getRegisteredEvents);

export default router;

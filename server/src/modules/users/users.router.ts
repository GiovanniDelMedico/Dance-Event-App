import { Router } from "express";
import * as usersController from "./users.controller";

const router = Router();

// POST /users/register
router.post("/register", usersController.register);

// POST /users/login
router.post("/login", usersController.login);

export default router;

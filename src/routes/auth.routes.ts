import express from "express";
import { register, login, refreshToken } from "../controllers/auth.controller";
import { authenticateUser } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);

export default router;

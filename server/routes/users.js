import { Router } from "express";
import { getUsers, getUsersById } from "../controllers/users.js";

const router = Router();

router.get("/api/users", getUsers);
router.get("/api/users/:id", getUsersById);

export default router;
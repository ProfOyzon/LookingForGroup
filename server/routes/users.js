import { Router } from "express";
import { getUsers, getUsersById, createUser } from "../controllers/users.js";

const router = Router();

router.get("/api/users", getUsers);
router.post("/api/users", createUser);
router.get("/api/users/:id", getUsersById);

export default router;
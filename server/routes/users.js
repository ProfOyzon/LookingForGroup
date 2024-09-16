import { Router } from "express";
import { getUsers, getUsersById, createUser, updateUser, addSkill, deleteSkill } from "../controllers/users.js";

const router = Router();

router.get("/api/users", getUsers);
router.post("/api/users", createUser);
router.get("/api/users/:id", getUsersById);
router.put("/api/users/:id", updateUser);
router.post("/api/users/skills/:id", addSkill);
router.delete("/api/users/skills/:id", deleteSkill);

export default router;
import { Router } from "express";
import { getUsers, getUsersById, createUser, updateUser, addSkill, deleteSkill, getUserByUsername, login } from "../controllers/users.js";

const router = Router();

router.get("/api/users", getUsers);
router.post("/api/users", createUser);
router.get("/api/users/:id", getUsersById);
router.get("/api/users/:username", getUserByUsername);
router.put("/api/users/:id", updateUser);
router.post("/api/users/:id/skills", addSkill);
router.delete("/api/users/:id/skills", deleteSkill);
router.post("/api/users/login", login);

export default router;
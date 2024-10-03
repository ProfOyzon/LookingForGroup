import { Router } from "express";
import { getUsers, getUsersById, createUser, updateUser, addSkill, 
    deleteSkill, getProjectFollowing, addProjectFollowing, deleteProjectFollowing } from "../controllers/users.js";

const router = Router();

router.get("/api/users", getUsers);
router.post("/api/users", createUser);
router.get("/api/users/:id", getUsersById);
router.put("/api/users/:id", updateUser);
router.post("/api/users/:id/skills", addSkill);
router.delete("/api/users/:id/skills", deleteSkill);
router.get("/api/users/:id/followings/projects", getProjectFollowing);
router.post("/api/users/:id/followings/projects", addProjectFollowing);
router.delete("/api/users/:id/followings/projects", deleteProjectFollowing);

export default router;
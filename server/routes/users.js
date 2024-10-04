import { Router } from "express";
import { getUsers, getUsersById, createUser, updateUser, addSkill, deleteSkill, getMyProjects,
    getProjectFollowing, addProjectFollowing, deleteProjectFollowing, getUserFollowing,
    addUserFollowing, deleteUserFollowing } from "../controllers/users.js";

const router = Router();

router.get("/api/users", getUsers);
router.post("/api/users", createUser);
router.get("/api/users/:id", getUsersById);
router.put("/api/users/:id", updateUser);
router.post("/api/users/:id/skills", addSkill);
router.delete("/api/users/:id/skills", deleteSkill);
router.get("/api/users/:id/projects", getMyProjects);
router.get("/api/users/:id/followings/projects", getProjectFollowing);
router.post("/api/users/:id/followings/projects", addProjectFollowing);
router.delete("/api/users/:id/followings/projects", deleteProjectFollowing);
router.get("/api/users/:id/followings/people", getUserFollowing);
router.post("/api/users/:id/followings/people", addUserFollowing);
router.delete("/api/users/:id/followings/people", deleteUserFollowing);

export default router;
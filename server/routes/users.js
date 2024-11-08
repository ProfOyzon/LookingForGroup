import { Router } from "express";
import mid from "../middleware/index.js";
import { getUsers, getUsersById, createUser, updateUser, updateProfilePicture, addSkill, deleteSkill, getMyProjects, getVisibleProjects,
    updateProjectVisibility, getProjectFollowing, addProjectFollowing, deleteProjectFollowing, 
    getUserFollowing, addUserFollowing, deleteUserFollowing, getUserByUsername, login, 
    getUsernameBySession} from "../controllers/users.js";

const router = Router();

router.get("/api/users", getUsers);
router.post("/api/users", createUser);
router.get("/api/users/:id", getUsersById);
router.get("/api/users/:username", getUserByUsername);
router.get("/api/users/get-username-session", getUsernameBySession);
router.put("/api/users/:id", updateUser);
router.put("/api/users/:id/profile-picture", mid.checkImageFile, updateProfilePicture);
router.post("/api/users/:id/skills", addSkill);
router.delete("/api/users/:id/skills", deleteSkill);
router.get("/api/users/:id/projects", getMyProjects);
router.get("/api/users/:id/projects/profile", getVisibleProjects);
router.put("/api/users/:id/projects/visibility", updateProjectVisibility);
router.get("/api/users/:id/followings/projects", getProjectFollowing);
router.post("/api/users/:id/followings/projects", addProjectFollowing);
router.delete("/api/users/:id/followings/projects", deleteProjectFollowing);
router.get("/api/users/:id/followings/people", getUserFollowing);
router.post("/api/users/:id/followings/people", addUserFollowing);
router.delete("/api/users/:id/followings/people", deleteUserFollowing);
router.post("/api/users/login", login);

export default router;
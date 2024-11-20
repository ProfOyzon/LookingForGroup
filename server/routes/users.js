import { Router } from "express";
import mid from "../middleware/index.js";
import userCtrl from "../controllers/users.js";

const router = Router();

router.post("/api/login", userCtrl.login);
router.post("/api/signup", userCtrl.signup);
router.get("/api/signup/:token", userCtrl.createUser);
router.post("/api/resets/password", userCtrl.requestPasswordReset);
router.post("/api/resets/password/:token", userCtrl.resetPassword);
router.get("/api/users", userCtrl.getUsers);
router.get("/api/users/:username", userCtrl.getUserByUsername);
router.get("/api/users/:id", userCtrl.getUserById);
router.put("/api/users/:id", userCtrl.updateUser);
router.put("/api/users/:id/password", userCtrl.updatePassword);
router.put("/api/users/:id/profile-picture", mid.checkImageFile, userCtrl.updateProfilePicture);
router.get("/api/users/:id/projects", userCtrl.getMyProjects);
router.get("/api/users/:id/projects/profile", userCtrl.getVisibleProjects);
router.put("/api/users/:id/projects/visibility", userCtrl.updateProjectVisibility);
router.get("/api/users/:id/followings/projects", userCtrl.getProjectFollowing);
router.post("/api/users/:id/followings/projects", userCtrl.addProjectFollowing);
router.delete("/api/users/:id/followings/projects", userCtrl.deleteProjectFollowing);
router.get("/api/users/:id/followings/people", userCtrl.getUserFollowing);
router.post("/api/users/:id/followings/people", userCtrl.addUserFollowing);
router.delete("/api/users/:id/followings/people", userCtrl.deleteUserFollowing);

export default router;
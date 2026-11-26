import { Router } from "express";
import { register, login, getMe, changePassword, listUsers, updateUserPermissions, updateUser, deleteUser } from "../controllers/authController.js";
import { authorizeRoles, protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/login", login);

router.post("/register", protect, authorizeRoles("ADMIN"), register);
router.get("/users", protect, authorizeRoles("ADMIN"), listUsers);
router.patch("/users/:id", protect, authorizeRoles("ADMIN"), updateUser);
router.patch("/users/:id/permissions", protect, authorizeRoles("ADMIN"), updateUserPermissions);
router.delete("/users/:id", protect, authorizeRoles("ADMIN"), deleteUser);
router.get("/me", protect, getMe);
router.patch("/password", protect, changePassword);

export default router;

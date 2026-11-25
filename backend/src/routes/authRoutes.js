import { Router } from "express";
import { register, login, getMe, changePassword } from "../controllers/authController.js";
import { authorizeRoles, protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/login", login);

router.post("/register", protect, authorizeRoles("ADMIN"), register);
router.get("/me", protect, getMe);
router.patch("/password", protect, changePassword);

export default router;

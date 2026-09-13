import { Router } from "express";
import {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctorController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = Router();

// Public routes (Website visitors can see doctors)
router.get("/", getDoctors);
router.get("/:id", getDoctorById);

// Admin only routes (Only ADMIN can add, update, or remove doctors)
router.post("/", protect, authorizeRoles("ADMIN"), createDoctor);
router.patch("/:id", protect, authorizeRoles("ADMIN"), updateDoctor);
router.delete("/:id", protect, authorizeRoles("ADMIN"), deleteDoctor);

export default router;

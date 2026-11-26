import { Router } from "express";
import {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctorController.js";
import { protect, authorizeRoles, authorizeSection } from "../middlewares/authMiddleware.js";

const router = Router();

// Public routes (Website visitors can see doctors)
router.get("/", getDoctors);
router.get("/:id", getDoctorById);

// Staff assigned to Doctors can add and edit profiles. Deletion is admin-only.
router.post("/", protect, authorizeSection("doctors"), createDoctor);
router.patch("/:id", protect, authorizeSection("doctors"), updateDoctor);
router.delete("/:id", protect, authorizeRoles("ADMIN"), deleteDoctor);

export default router;

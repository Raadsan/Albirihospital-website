import { Router } from "express";
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
} from "../controllers/appointmentController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = Router();

// Public: Anyone can request an appointment booking from the website
router.post("/", createAppointment);

// Protected: ADMIN and RECEPTIONIST can view list, view single, and update status
router.get("/", protect, authorizeRoles("ADMIN", "RECEPTIONIST"), getAppointments);
router.get("/:id", protect, authorizeRoles("ADMIN", "RECEPTIONIST"), getAppointmentById);
router.patch("/:id/status", protect, authorizeRoles("ADMIN", "RECEPTIONIST"), updateAppointmentStatus);

// Admin only: Can delete an appointment record
router.delete("/:id", protect, authorizeRoles("ADMIN"), deleteAppointment);

export default router;

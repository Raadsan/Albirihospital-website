import { Router } from "express";
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
} from "../controllers/appointmentController.js";
import { protect, authorizeRoles, authorizeSection } from "../middlewares/authMiddleware.js";

const router = Router();

// Public: Anyone can request an appointment booking from the website
router.post("/", createAppointment);

// Staff assigned to Appointments can view requests and update their status.
router.get("/", protect, authorizeSection("appointments"), getAppointments);
router.get("/:id", protect, authorizeSection("appointments"), getAppointmentById);
router.patch("/:id/status", protect, authorizeSection("appointments"), updateAppointmentStatus);
router.delete("/:id", protect, authorizeRoles("ADMIN"), deleteAppointment);

export default router;

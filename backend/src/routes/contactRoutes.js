import { Router } from "express";
import {
  createContactMessage,
  getContactMessages,
  getContactMessageById,
  updateContactMessageStatus,
  deleteContactMessage,
} from "../controllers/contactController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = Router();

// Public: Submit inquiry from contact page
router.post("/", createContactMessage);

// Protected: Staff/Admin view and manage messages
router.get("/", protect, authorizeRoles("ADMIN", "RECEPTIONIST"), getContactMessages);
router.get("/:id", protect, authorizeRoles("ADMIN", "RECEPTIONIST"), getContactMessageById);
router.patch("/:id/status", protect, authorizeRoles("ADMIN", "RECEPTIONIST"), updateContactMessageStatus);

// Protected: Admin only delete message
router.delete("/:id", protect, authorizeRoles("ADMIN"), deleteContactMessage);

export default router;

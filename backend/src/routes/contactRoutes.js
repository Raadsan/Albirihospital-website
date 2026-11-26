import { Router } from "express";
import {
  createContactMessage,
  getContactMessages,
  getContactMessageById,
  updateContactMessageStatus,
  deleteContactMessage,
} from "../controllers/contactController.js";
import { protect, authorizeRoles, authorizeSection } from "../middlewares/authMiddleware.js";

const router = Router();

// Public: Submit inquiry from contact page
router.post("/", createContactMessage);

// Staff assigned to Messages can view inquiries and update their status.
router.get("/", protect, authorizeSection("contact"), getContactMessages);
router.get("/:id", protect, authorizeSection("contact"), getContactMessageById);
router.patch("/:id/status", protect, authorizeSection("contact"), updateContactMessageStatus);
router.delete("/:id", protect, authorizeRoles("ADMIN"), deleteContactMessage);

export default router;

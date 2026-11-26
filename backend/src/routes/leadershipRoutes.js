import { Router } from "express";
import {
  getLeadership,
  getLeadershipById,
  createLeadership,
  updateLeadership,
  deleteLeadership,
} from "../controllers/leadershipController.js";
import { protect, authorizeRoles, authorizeSection } from "../middlewares/authMiddleware.js";

const router = Router();

// Public: View leadership members
router.get("/", getLeadership);
router.get("/:id", getLeadershipById);

// Protected: Admin manage leadership team
router.post("/", protect, authorizeSection("leadership"), createLeadership);
router.patch("/:id", protect, authorizeSection("leadership"), updateLeadership);
router.delete("/:id", protect, authorizeRoles("ADMIN"), deleteLeadership);

export default router;

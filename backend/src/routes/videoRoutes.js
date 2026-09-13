import { Router } from "express";
import {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
} from "../controllers/videoController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = Router();

// Public routes (Website visitors can see health videos)
router.get("/", getVideos);
router.get("/:id", getVideoById);

// Admin only routes (Only ADMIN can add, update, or remove videos)
router.post("/", protect, authorizeRoles("ADMIN"), createVideo);
router.patch("/:id", protect, authorizeRoles("ADMIN"), updateVideo);
router.delete("/:id", protect, authorizeRoles("ADMIN"), deleteVideo);

export default router;

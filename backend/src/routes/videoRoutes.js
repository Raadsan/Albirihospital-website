import { Router } from "express";
import {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
} from "../controllers/videoController.js";
import { protect, authorizeRoles, authorizeSection, protectDrafts } from "../middlewares/authMiddleware.js";

const router = Router();

// Public routes (Website visitors can see health videos)
router.get("/", protectDrafts("videos"), getVideos);
router.get("/:id", getVideoById);

// Staff assigned to Health Videos can add and edit videos. Deletion is admin-only.
router.post("/", protect, authorizeSection("videos"), createVideo);
router.patch("/:id", protect, authorizeSection("videos"), updateVideo);
router.delete("/:id", protect, authorizeRoles("ADMIN"), deleteVideo);

export default router;

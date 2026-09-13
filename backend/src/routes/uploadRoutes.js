import { Router } from "express";
import {
  uploadSingleImage,
  uploadMultipleImages,
  deleteUploadedImage,
} from "../controllers/uploadController.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = Router();

// Upload single image (Admin only)
router.post(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  upload.single("image"),
  uploadSingleImage
);

// Upload multiple images (Admin only)
router.post(
  "/multiple",
  protect,
  authorizeRoles("ADMIN"),
  upload.array("images", 5),
  uploadMultipleImages
);

// Delete an uploaded image (Admin only)
router.delete(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  deleteUploadedImage
);

export default router;

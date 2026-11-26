import { Router } from "express";
import {
  uploadSingleImage,
  uploadMultipleImages,
  deleteUploadedImage,
} from "../controllers/uploadController.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { protect, authorizeRoles, authorizeSection } from "../middlewares/authMiddleware.js";

const router = Router();

const imageSections = new Set(["doctors", "leadership", "blogs"]);

function authorizeImageUpload(req, res, next) {
  if (req.user.role === "ADMIN") return next();
  const { section } = req.query;
  if (!imageSections.has(section)) {
    return res.status(403).json({ success: false, error: "Choose an authorized image upload section." });
  }
  req.uploadFolder = section;
  return authorizeSection(section)(req, res, next);
}

function setVideoFolder(req, _res, next) {
  req.uploadFolder = "videos";
  next();
}

// Upload an image for an authorized content section.
router.post(
  "/",
  protect,
  authorizeImageUpload,
  upload.single("image"),
  uploadSingleImage
);

// Upload a health video file.
router.post(
  "/media",
  protect,
  authorizeSection("videos"),
  setVideoFolder,
  upload.single("file"),
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

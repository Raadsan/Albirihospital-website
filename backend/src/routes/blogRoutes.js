import { Router } from "express";
import {
  getBlogs,
  getBlogByIdOrSlug,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = Router();

// Public routes (Website visitors can view all blogs or single article by id/slug)
router.get("/", getBlogs);
router.get("/:idOrSlug", getBlogByIdOrSlug);

// Admin only routes (Only ADMIN can create, update, or delete blog articles)
router.post("/", protect, authorizeRoles("ADMIN"), createBlog);
router.patch("/:id", protect, authorizeRoles("ADMIN"), updateBlog);
router.delete("/:id", protect, authorizeRoles("ADMIN"), deleteBlog);

export default router;

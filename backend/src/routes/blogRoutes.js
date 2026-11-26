import { Router } from "express";
import {
  getBlogs,
  getBlogByIdOrSlug,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import { protect, authorizeRoles, authorizeSection, protectDrafts } from "../middlewares/authMiddleware.js";

const router = Router();

// Public routes (Website visitors can view all blogs or single article by id/slug)
router.get("/", protectDrafts("blogs"), getBlogs);
router.get("/:idOrSlug", getBlogByIdOrSlug);

// Staff assigned to News & Blogs can add and edit articles. Deletion is admin-only.
router.post("/", protect, authorizeSection("blogs"), createBlog);
router.patch("/:id", protect, authorizeSection("blogs"), updateBlog);
router.delete("/:id", protect, authorizeRoles("ADMIN"), deleteBlog);

export default router;

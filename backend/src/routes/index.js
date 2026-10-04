import { Router } from "express";
import authRoutes from "./authRoutes.js";
import appointmentRoutes from "./appointmentRoutes.js";
import doctorRoutes from "./doctorRoutes.js";
import videoRoutes from "./videoRoutes.js";
import blogRoutes from "./blogRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import contactRoutes from "./contactRoutes.js";
import leadershipRoutes from "./leadershipRoutes.js";

const apiRouter = Router();

// Mount routes
apiRouter.use("/auth", authRoutes);
apiRouter.use("/appointments", appointmentRoutes);
apiRouter.use("/doctors", doctorRoutes);
apiRouter.use("/videos", videoRoutes);
apiRouter.use("/blogs", blogRoutes);
apiRouter.use("/upload", uploadRoutes);
apiRouter.use("/contact", contactRoutes);
apiRouter.use("/leadership", leadershipRoutes);

export default apiRouter;

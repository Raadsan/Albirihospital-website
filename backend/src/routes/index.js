import { Router } from "express";
import authRoutes from "./authRoutes.js";
import appointmentRoutes from "./appointmentRoutes.js";
import doctorRoutes from "./doctorRoutes.js";
import videoRoutes from "./videoRoutes.js";
import blogRoutes from "./blogRoutes.js";
import uploadRoutes from "./uploadRoutes.js";

const apiRouter = Router();

// Mount routes
apiRouter.use("/auth", authRoutes);
apiRouter.use("/appointments", appointmentRoutes);
apiRouter.use("/doctors", doctorRoutes);
apiRouter.use("/videos", videoRoutes);
apiRouter.use("/blogs", blogRoutes);
apiRouter.use("/upload", uploadRoutes);

export default apiRouter;

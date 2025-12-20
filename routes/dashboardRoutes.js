import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { dashboardStats } from "../controller/dashboard.controller.js";

const router = express.Router();

router.get("/", protect(), dashboardStats);

export default router;

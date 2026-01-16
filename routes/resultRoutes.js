import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getExamResults } from "../controller/resultController.js";

const router = express.Router();

router.get("/:examId/all", protect(["teacher", "admin"]), getExamResults);
export default router;

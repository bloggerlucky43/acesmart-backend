import express from "express";
import { createExam, getExamsByCreator } from "../controller/examController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/", protect(), createExam);
router.get("/", protect(), getExamsByCreator);
export default router;

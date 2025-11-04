import express from "express";
import {
  createExam,
  getExamQuestions,
  getExamsByCreator,
  studentExamLogin,
} from "../controller/examController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/", protect(), createExam);
router.get("/", protect(), getExamsByCreator);
router.post("/login", studentExamLogin);
router.get("/:studentId/:examId", getExamQuestions);
export default router;

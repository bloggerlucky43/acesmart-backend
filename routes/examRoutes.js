import express from "express";
import {
  createExam,
  getExamQuestions,
  getExamsByCreator,
  saveExamResult,
  studentExamLogin,
} from "../controller/examController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/save-result", saveExamResult);
router.post("/", protect(["teacher"]), createExam);
router.get("/", protect(["teacher"]), getExamsByCreator);
router.post("/login", studentExamLogin);
router.get("/:studentId/:examId", getExamQuestions);
export default router;

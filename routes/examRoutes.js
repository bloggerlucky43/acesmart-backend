import express from "express";
import {
  checkResultExisting,
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
router.get("/result/:studentId/:examId", checkResultExisting);
export default router;

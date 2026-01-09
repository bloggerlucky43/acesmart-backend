import express from "express";
import { getQuestions } from "../controller/questionController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", protect(["teacher", "admin"]), getQuestions);
export default router;

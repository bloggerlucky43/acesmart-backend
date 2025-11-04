import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addStudent, fetchStudents } from "../controller/studentController.js";
const router = express.Router();

router.post("/", protect(), addStudent);
router.get("/", protect(), fetchStudents);
export default router;

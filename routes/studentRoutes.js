import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  activateStudent,
  addStudent,
  deactivateStudent,
  deleteStudent,
  fetchStudents,
} from "../controller/studentController.js";
const router = express.Router();

router.post("/", protect(), addStudent);
router.get("/", protect(), fetchStudents);
router.put("/:studentId/activate", protect(), activateStudent);
router.put("/:studentId/deactivate", protect(), deactivateStudent);
router.delete("/:studentId", protect(), deleteStudent);
export default router;

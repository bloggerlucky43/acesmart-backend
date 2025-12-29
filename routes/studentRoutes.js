import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  activateStudent,
  addStudent,
  deactivateStudent,
  deleteStudent,
  fetchStudents,
  getStudentFace,
  uploadFace,
  // verifyExamFace,
} from "../controller/studentController.js";
import upload from "../middleware/upload.js";
// import multer from "multer";

const router = express.Router();

router.post("/upload-face", upload.single("face"), uploadFace);
router.get("/face/:studentId", getStudentFace);
router.post("/", protect(), upload.single("face"), addStudent);
router.get("/", protect(), fetchStudents);

router.put("/:studentId/activate", protect(), activateStudent);
router.put("/:studentId/deactivate", protect(), deactivateStudent);
router.delete("/:studentId", protect(), deleteStudent);
export default router;

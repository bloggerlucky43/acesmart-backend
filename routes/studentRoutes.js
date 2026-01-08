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

router.post(
  "/upload-face",
  protect(["teacher", "admin"]),
  upload.single("face"),
  uploadFace
);
router.get("/face/:studentId", getStudentFace);
router.post(
  "/",
  protect(["teacher", "admin"]),
  upload.single("face"),
  addStudent
);
router.get("/", protect(["teacher"]), fetchStudents);

router.put("/:studentId/activate", protect(["teacher"]), activateStudent);
router.put("/:studentId/deactivate", protect(["teacher"]), deactivateStudent);
router.delete("/:studentId", protect(["teacher"]), deleteStudent);
export default router;

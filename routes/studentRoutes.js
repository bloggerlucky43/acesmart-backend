import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addStudent } from "../controller/studentController.js";
const router = express.Router();

router.post("/",protect(), addStudent);
export default router;


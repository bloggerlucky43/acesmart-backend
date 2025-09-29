import express from "express";
import {
  register,
  Login,
  GetSingleUser,
} from "../controller/authController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", Login);
router.get("/me", protect(), GetSingleUser);

export default router;

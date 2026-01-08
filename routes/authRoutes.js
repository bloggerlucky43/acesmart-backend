import express from "express";
import {
  register,
  Login,
  GetSingleUser,
  logout,
} from "../controller/authController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/login", Login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/me", protect(["teacher"]), GetSingleUser);

export default router;

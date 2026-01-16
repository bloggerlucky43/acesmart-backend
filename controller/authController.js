import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
import { Op } from "sequelize";

dotenv.config();
const saltRound = Number(process.env.SALT);
export const register = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
      confirmPassword,
      role,
      phoneNumber,
    } = req.body;
    console.log("The register body:", req.body);

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !role ||
      !username ||
      !phoneNumber
    )
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });

    if (password.trim() !== confirmPassword.trim())
      return res.status(400).json({ message: "Password mismatch" });
    if (username) {
      const existingUsername = await User.findOne({ where: { username } });

      console.log("Username already exists", existingUsername);

      if (existingUsername) {
        return res
          .status(400)
          .json({ error: "Username already exists", success: false });
      }
    }

    if (email) {
      const existingEmail = await User.findOne({ where: { email } });
      console.log("User email exists", existingEmail);

      if (existingEmail) {
        return res
          .status(400)
          .json({ error: "Email already exists", success: false });
      }
    }

    //hash password if provided
    const hashedPassword = await bcrypt.hash(password, saltRound);
    console.log("Hashed password is", hashedPassword);

    //create user
    const user = await User.create({
      name,
      phoneNumber: phoneNumber.trim(),
      username: username.trim().toLowerCase(),
      email: email.trim(),
      password: hashedPassword,
      role: "teacher",
    });

    console.log("user is created", user);

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000,
      })
      .json({
        message: "User registered successfully",
        success: true,
        data: {
          _id: user.id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          username: user.username,
        },
      });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const Login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    console.log("The login info", req.body);
    console.log("The login info", req.body);

    if (!usernameOrEmail || !password)
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });

    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: usernameOrEmail.trim() },
          { username: usernameOrEmail.trim() },
        ],
      },
    });

    console.log(user, "At checkpoint");

    if (!user || !user.password)
      return res.status(400).json({ error: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password.trim(), user.password);

    if (!validPassword)
      return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000 * 24,
      // sameSite: "lax",
    });

    res.json({
      message: "Login successful",
      success: true,
      data: {
        _id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const GetSingleUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
    });
    if (!user) return res.status(404).json({ message: "Invalid credentials" });

    res.status(200).json({
      message: "User fetch successful",
      success: true,
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

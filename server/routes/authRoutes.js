import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();


// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists ❌" });
    }

    const user = await User.create({ username, email, password });

    res.status(201).json({
      message: "User registered successfully ✅",
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed ❌", error });
  }
});


// ================= LOGIN (JWT) =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials ❌" });
    }

    // Plain text check (for now)
    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid credentials ❌" });
    }

    // ✅ CREATE TOKEN
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful ✅",
      token,
    });

  } catch (err) {
    res.status(500).json({ message: "Server error ❌" });
  }
});


export default router;

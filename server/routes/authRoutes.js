import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists ❌" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashed,
    });

    res.json({ message: "User registered successfully ✅" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Register failed ❌" });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found ❌" });
    }

    // TEMP DEBUG LOGIN (accept plain password OR bcrypt)
    const bcryptMatch = await bcrypt.compare(password, user.password);
    const plainMatch = password === user.password;

    if (!bcryptMatch && !plainMatch) {
      return res.status(400).json({ message: "Invalid credentials ❌" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful ✅",
      token,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error ❌" });
  }
});

export default router;
import express from "express";
import Note from "../models/Note.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();


// ================= GET USER NOTES =================
router.get("/", protect, async (req, res) => {
  try {
    console.log("User requesting notes:", req.user._id);

    const notes = await Note.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Failed to load notes ❌" });
  }
});


// ================= CREATE NOTE =================
router.post("/", protect, async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const note = await Note.create({
      title,
      content,
      tags,
      user: req.user._id,
    });

    res.status(201).json(note);
  } catch {
    res.status(500).json({ message: "Failed ❌" });
  }
});
router.put("/:id", protect, async (req, res) => {
  const { title, content, tags } = req.body;

  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { title, content, tags },
    { new: true }
  );

  res.json(note);
});


// ================= DELETE NOTE =================
router.delete("/:id", protect, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found ❌" });
    }

    res.json({ message: "Note deleted ✅" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed ❌" });
  }
});

export default router;
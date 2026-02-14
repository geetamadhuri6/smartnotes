import express from "express";
import Note from "../models/Note.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();


// ================= GET USER NOTES =================
router.get("/", protect, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Failed to load notes ❌" });
  }
});


// ================= CREATE NOTE =================
router.post("/", protect, async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.create({
      title,
      content,
      user: req.user._id, // 🔥 IMPORTANT
    });

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: "Failed to create note ❌" });
  }
});


// ================= DELETE NOTE =================
router.delete("/:id", protect, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id, // 🔥 ensures ownership
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found ❌" });
    }

    await note.deleteOne();

    res.json({ message: "Note deleted ✅" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed ❌" });
  }
});

export default router;
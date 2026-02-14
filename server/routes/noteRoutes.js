import express from "express";
import Note from "../models/Note.js";
import auth from "../middleware/auth.js";

const router = express.Router();


// ================= GET NOTES (only my notes) =================
router.get("/", auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch {
    res.status(500).json({ message: "Failed to fetch notes ❌" });
  }
});


// ================= CREATE NOTE =================
router.post("/", auth, async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.create({
      title,
      content,
      user: req.user.id,
    });

    res.json(note);
  } catch {
    res.status(500).json({ message: "Failed to create note ❌" });
  }
});


// ================= DELETE NOTE =================
router.delete("/:id", auth, async (req, res) => {
  try {
    await Note.deleteOne({
      _id: req.params.id,
      user: req.user.id,
    });

    res.json({ message: "Deleted ✅" });
  } catch {
    res.status(500).json({ message: "Delete failed ❌" });
  }
});

export default router;
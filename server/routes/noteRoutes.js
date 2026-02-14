import express from "express";
import Note from "../models/Note.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();


// ================= GET NOTES (ONLY USER) =================
router.get("/", protect, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
});


// ================= CREATE NOTE =================
router.post("/", protect, async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.create({
      title,
      content,
      user: req.user.id,
    });

    res.json({
      message: "Note created ✅",
      note,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating note ❌" });
  }
});


// ================= UPDATE NOTE =================
router.put("/:id", protect, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!note)
      return res.status(404).json({ message: "Note not found ❌" });

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: "Error updating note ❌" });
  }
});


// ================= DELETE NOTE =================
router.delete("/:id", protect, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!note)
      return res.status(404).json({ message: "Note not found ❌" });

    res.json({ message: "Note deleted ✅" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting note ❌" });
  }
});

export default router;
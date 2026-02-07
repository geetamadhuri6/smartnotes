import express from "express";
import Note from "../models/Note.js";
import protect from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = new Note({
      title,
      content,
      user: req.userId, // 🔥 important
    });

    await note.save();

    res.json({
      message: "Note created successfully ✅",
      note,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating note ❌" });
  }
});




// DELETE note by ID
router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found ❌" });
    }

    res.json({ message: "Note deleted successfully 🗑️" });
  } catch (error) {
    res.status(500).json({ message: "Server error ❌", error });
  }
});
// UPDATE note by ID
router.put("/:id", async (req, res) => {
  try {
    const { title, content } = req.body;

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({
        message: "Note not found ❌",
      });
    }

    res.json({
      message: "Note updated successfully ✏️",
      note: updatedNote,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error ❌",
      error,
    });
  }
});
// GET ALL NOTES
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notes" });
  }
});



export default router;

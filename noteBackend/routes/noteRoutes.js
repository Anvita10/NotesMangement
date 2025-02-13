const express = require("express");
const multer = require("multer");
const path = require("path");
const Note = require("../models/Note");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Define where to store the uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use current timestamp for unique filenames
  },
});

const upload = multer({ storage });

// ✅ Add a new note with an optional image
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { title, content } = req.body;
    const image = req.file ? req.file.path : null; // Get image path from multer
    const favorite = req.body.favorite || false; // Optional: Set favorite status from request, default to false

    // Create a new note
    const newNote = new Note({
      userId: req.user.userId,
      title,
      content,
      image, // Store the image path if an image is uploaded
      favorite, // Add favorite status
    });

    await newNote.save();
    res.status(201).json({ message: "Note added successfully", note: newNote });
  } catch (error) {
    console.error("Error adding note:", error);
    res.status(500).json({ message: "Server error, please try again" });
  }
});

// ✅ Get all notes for a user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });
    res.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Server error, please try again" });
  }
});

// ✅ Update a note (with optional image update and favorite status)
router.put("/:id", authMiddleware, upload.single("image"), async (req, res) => {
  const { title, content, favorite } = req.body; // Get favorite status from the request
  try {
    const noteData = {
      title,
      content,
      favorite, // Update favorite status
    };

    // If a new image is uploaded, update the image
    if (req.file) {
      noteData.image = req.file.path;
    }

    const updatedNote = await Note.findByIdAndUpdate(req.params.id, noteData, {
      new: true,
    });
    res.json(updatedNote);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Server error, please try again" });
  }
});

// ✅ Toggle favorite status for a note
router.patch("/:id/favorite", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Toggle the favorite field
    note.favorite = !note.favorite;
    await note.save();

    res.json(note);
  } catch (error) {
    console.error("Error updating favorite status:", error);
    res.status(500).json({ message: "Server error, please try again" });
  }
});

// ✅ Delete a note
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Server error, please try again" });
  }
});

module.exports = router;

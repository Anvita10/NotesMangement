const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      // Optional: Store the image URL (if using a cloud or public directory)
      type: String,
      default: "",
    },
    favorite: {
      // Boolean to mark the note as favorite
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // Adds createdAt & updatedAt timestamps
);

module.exports = mongoose.model("Note", NoteSchema);

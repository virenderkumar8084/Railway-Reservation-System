const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); // Import uuid library

const bookSchema = new mongoose.Schema({
  train: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "train",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  bookingId: {
    type: String,
    default: () => uuidv4(), // Generate a unique booking ID using uuid
    unique: true, // Ensure the booking ID is unique
  },
  status: {
    type: String,
    default : "confirmed",
  },
  createdAt: {
    type: Date,
    default: Date.now, // Add a timestamp for when the booking was created
  },
});

module.exports = mongoose.model("book", bookSchema);
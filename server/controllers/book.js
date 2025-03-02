const book = require("../models/book");
const user = require("../models/user");
const train = require("../models/trains");

/*
method: POST
route: /api/book/
description: creates a booking
*/
const createBook = async (req, res) => {
  try {
    // Extract details from request body
    const { train_id, user_id } = req.body;

    // Validation checks
    if (!train_id || !user_id) {
      return res.status(400).json({ msg: "Please enter all the fields" });
    }

    // Find train and user in the database
    const train_available = await train.findById(train_id);
    const user_available = await user.findById(user_id);

    if (!train_available) return res.status(404).json({ msg: "Train ID not valid" });
    if (!user_available) return res.status(404).json({ msg: "User ID not valid" });

    // Check if there are available seats
    if (train_available.availableSeats <= 0) {
      return res.status(400).json({ msg: "No available seats" });
    }

    // Create and save a new booking
    const newBook = new book({
      user: user_available._id,
      train: train_available._id,
      // No need to manually add bookingId or createdAt as they are auto-generated by the schema
    });

    await newBook.save();

    // Decrease the availableSeats count by 1
    train_available.availableSeats -= 1;

    // Update train document in DB
    await train_available.save();

    res.status(200).json({
      msg: "Booking successful",
      book: newBook, // This will include the auto-generated bookingId and createdAt
      updatedAvailableSeats: train_available.availableSeats,
    });

  } catch (error) {
    console.error("Error in createBook:", error);
    res.status(500).json({ msg: "Internal Server Error", error });
  }
};


/*
method: GET
route: /api/book/
description: gets all bookings
*/
const getBooks = (req, res) => {
  book
    .find()
    .sort({ startDate: -1 })
    .then((books) => {
      res.json({
        books,
      });
    })
    .catch((err) => console.log(err));
};

/*
method: DELETE
route: /api/book/:id
description: deletes a booking
*/
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the booking exists
    const bookExist = await book.findById(id);
    if (!bookExist) {
      return res.status(404).json({ msg: "Booking does not exist" });
    }

    // Get user ID and train ID from booking
    const user_id = bookExist.user;
    const train_id = bookExist.train;

    // Find the train
    const trainExist = await train.findById(train_id);
    if (!trainExist) {
      return res.status(404).json({ msg: "Train not found" });
    }

    // Remove user from train's user list
    trainExist.users = trainExist.users.filter(
      (user) => String(user) !== String(user_id)
    );

    // Increment available seats by 1
    trainExist.availableSeats += 1;

    // Save the updated train document
    await trainExist.save();

    // Delete the booking
    await bookExist.deleteOne();

    res.status(200).json({
      msg: "Booking deleted successfully",
      updatedAvailableSeats: trainExist.availableSeats,
    });

  } catch (error) {
    console.error("Error in deleteBook:", error);
    res.status(500).json({ msg: "Internal Server Error", error });
  }
};


/*
method: GET
route: /api/book/:id
description: gets a single booking
*/
const getBook = async (req, res) => {
  const { id } = req.params;

  const bookExist = await book.findOne({ _id: id });

  if (!bookExist) return res.json({ msg: "Booking does not exist" });

  res.json({
    booking_id: bookExist._id,
    train_id: bookExist.train,
    user_id: bookExist.user,
  });
};

module.exports = { createBook, getBooks, deleteBook, getBook };

import "./trainitem.css";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { createBook } from "../../api/index"; // Existing API function

const TrainItem = (props) => {
  const user = useSelector((state) => state.user);

  // State for booking and seat updates
  const [isBooked, setIsBooked] = useState(false);
  const [availableSeats, setAvailableSeats] = useState(props.train.availableSeats);

  // Retrieve booking status from localStorage on component mount
  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem("bookings")) || {};
    if (storedBookings[`${user.id}-${props.train._id}`]) {
      setIsBooked(true);
    }
  }, [user.id, props.train._id]);

  // Listen for changes in the booking status (e.g., when a booking is deleted)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "bookings") {
        const storedBookings = JSON.parse(e.newValue) || {};
        setIsBooked(storedBookings[`${user.id}-${props.train._id}`] || false);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [user.id, props.train._id]);

  const buttonClick = async (e) => {
    e.preventDefault();

    if (isBooked || availableSeats === 0) return; // Prevent booking if seats are 0

    try {
      const { data } = await createBook(user.id, props.train._id);
      console.log(data);

      // After successful booking, disable button and decrease available seats
      setIsBooked(true);
      setAvailableSeats((prevSeats) => Math.max(0, prevSeats - 1)); // Ensure it doesn't go below 0

      // Store booking status in localStorage
      const storedBookings = JSON.parse(localStorage.getItem("bookings")) || {};
      storedBookings[`${user.id}-${props.train._id}`] = true;
      localStorage.setItem("bookings", JSON.stringify(storedBookings));

    } catch (error) {
      console.error("Booking failed:", error);
    }
  };

  return (
    <div className="train-item">
      <div className="train-info">
        <h2 id="train-name">{props.train.name}</h2>
        <h3 id="start-destination">
          From: {props.train.startpoint} - To: {props.train.destination}
        </h3>

        <div className="train-details">
          <h3 id="startDate">🚆 Starting Date: {props.train.startDate.slice(0, 10)}</h3>
          <h3 id="price">💰 Ticket Price: Rs {props.train.price}</h3>
          <h3 id="capacity">🎟️ Total Capacity: {props.train.capacity}</h3>
          <h3 id="availableSeats">
            🟢 Available Seats: {availableSeats > 0 ? availableSeats : 0}
          </h3>
        </div>
      </div>

      <div className="button-container">
        {user.name && (
          <button
            className={`book-button ${isBooked || availableSeats === 0 ? "disabled" : ""}`}
            onClick={buttonClick}
            disabled={isBooked || availableSeats === 0}
          >
            {availableSeats === 0 ? "No Seats available" : isBooked ? "Booked ✅" : "Book Now"}
          </button>
        )}
      </div>
    </div>
  );
};

export default TrainItem;


import * as api from "../../api";
import "./BookDetail.css";
import { useEffect, useState } from "react";

export default (props) => {
  const [train, setTrain] = useState({});

  useEffect(() => {
    api
      .getTrain(props.book.train)
      .then((res) => setTrain(res))
      .catch((err) => console.log(err));
  }, [props.book.train]);

  const handleDelete = () => {
    // Call the onDelete function passed from the parent
    props.onDelete(props.book._id);

    // Update localStorage to remove the booking status
    const storedBookings = JSON.parse(localStorage.getItem("bookings")) || {};
    delete storedBookings[`${props.book.user}-${props.book.train}`];
    localStorage.setItem("bookings", JSON.stringify(storedBookings));

    // Trigger a storage event to notify other components
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="book-detail-item">
      <h3>Train Name: {train.name}</h3>
      <h4>
        From: {train.startpoint} To: {train.destination}
      </h4>
      <h4>Booking ID: {props.book.bookingId}</h4>
      <h4>
        Booking Date: {new Date(props.book.createdAt).toLocaleDateString()}
      </h4>
      <h4>
        Status: {props.book.status === "confirmed" ? "Confirmed" : "Pending"}
      </h4>
      <button onClick={handleDelete} id="cancel-button">
        Cancel
      </button>
    </div>
  );
};
// import { useSelector, useDispatch } from "react-redux";
// import { useEffect } from "react";
// import { getBooks } from "../../actions/book";
// import BookDetail from "./BookDetail";
// import * as api from "../../api";
// import "./Profile.css";

// const Profile = () => {
//   const user = useSelector((state) => state.user);
//   const books = useSelector((state) => state.books);
//   const dispatch = useDispatch();

//   const onDelete = async (id) => {
//     try {
//       await api.deleteBook(id);
//       dispatch(getBooks()); // Refresh bookings list after deletion
//     } catch (error) {
//       console.error("Delete failed:", error);
//     }
//   };

//   useEffect(() => {
//     dispatch(getBooks());
//   }, [dispatch]);

//   const filt_books = books.filter((book) => book.user.includes(user.id));

//   if (!user.name) {
//     return <h1 className="not-logged-in">Please login to view your profile</h1>;
//   }

//   return (
//     <div className="profile-container">
//       {/* User Information Section */}
//       <div className="user-info-section">
//         <h2 className="profile-section-title">User Profile</h2>
//         <div className="user-info-grid">
//           <div className="user-info-card">
//             <span className="info-label">Name:</span>
//             <span className="info-value">{user.name}</span>
//           </div>
//           <div className="user-info-card">
//             <span className="info-label">Email:</span>
//             <span className="info-value">{user.email}</span>
//           </div>
//           <div className="user-info-card">
//             <span className="info-label">Phone:</span>
//             <span className="info-value">{user.phone}</span>
//           </div>
//         </div>
//       </div>

//       {/* Bookings Section */}
//       <div className="bookings-section">
//         <h2 className="profile-section-title">Your Bookings</h2>
//         {filt_books.length === 0 ? (
//           <p className="no-bookings">No bookings found</p>
//         ) : (
//           filt_books.map((book) => (
//             <BookDetail key={book._id} book={book} onDelete={onDelete} />
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Profile;

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getBooks } from "../../actions/book";
import BookDetail from "./BookDetail";
import * as api from "../../api";
import "./Profile.css";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const books = useSelector((state) => state.books);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  const onDelete = async (id) => {
    try {
      await api.deleteBook(id);
      dispatch(getBooks()); // Refresh bookings list after deletion
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  useEffect(() => {
    dispatch(getBooks());
  }, [dispatch]);

  const filt_books = books.filter((book) => book.user.includes(user.id));

  const filteredBooks = filt_books.filter((book) =>
    book.bookingId.includes(searchTerm)
  );

  if (!user.name) {
    return <h1 className="not-logged-in">Please login to view your profile</h1>;
  }

  return (
    <div className="profile-container">
      {/* User Information Section */}
      <div className="user-info-section">
        <h2 className="profile-section-title">User Profile</h2>
        <div className="user-info-grid">
          <div className="user-info-card">
            <span className="info-label">Name:</span>
            <span className="info-value">{user.name}</span>
          </div>
          <div className="user-info-card">
            <span className="info-label">Email:</span>
            <span className="info-value">{user.email}</span>
          </div>
          <div className="user-info-card">
            <span className="info-label">Phone:</span>
            <span className="info-value">{user.phone}</span>
          </div>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="bookings-section">
        <h2 className="profile-section-title">Your Bookings</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by Booking ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {filteredBooks.length === 0 ? (
          <p className="no-bookings">No bookings found</p>
        ) : (
          filteredBooks.map((book) => (
            <BookDetail key={book._id} book={book} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
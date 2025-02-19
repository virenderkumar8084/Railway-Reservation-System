import { Link } from "react-router-dom";
import "./navbar.css";
import { useSelector } from "react-redux";

const Navbar = () => {
  const user = useSelector((state) => state.user);

  const renderAuthLinks = () => {
    if (!user.name) {
      return (
        <>
          <Link className="link" to="/login">
            Login
          </Link>
          <Link className="link" to="/signup">
            Signup
          </Link>
        </>
      );
    } else {
      return (
        <>
          <Link className="link" to="/profile">
            My Bookings
          </Link>
          <Link className="link" to="/logout">
            Logout
          </Link>
        </>
      );
    }
  };

  return (
    <div className="navbar-container">
      <div className="navbar">
        <div className="nav-links">
          <Link className="link" to="/">
            Home
          </Link>
          {renderAuthLinks()}
        </div>
      </div>
      <div className="lowerDesign"></div>
    </div>
  );
};

export default Navbar;
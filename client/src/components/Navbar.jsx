
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, UserRound, ArrowRight, LogOut } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  // Check whether a customer is logged in
  const token = sessionStorage.getItem("token");
  const savedUser = sessionStorage.getItem("user");

  const user = savedUser ? JSON.parse(savedUser) : null;
  const isLoggedIn = Boolean(token && user);

  function handleLogout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    setMenuOpen(false);
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <span className="logo-icon">C</span>
          Co-op<span>Serve</span>
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <Menu size={24} />
        </button>

        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <NavLink to="/" onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>

          <NavLink to="/services" onClick={() => setMenuOpen(false)}>
            Services
          </NavLink>

          {isLoggedIn && (
            <NavLink
              to="/my-bookings"
              onClick={() => setMenuOpen(false)}
            >
              My Bookings
            </NavLink>
          )}
        </nav>

        <div className="nav-actions">
          {isLoggedIn ? (
            <>
              <span className="login-link">
                <UserRound size={18} />
                {user.name}
              </span>

              <button
                className="btn btn-primary nav-cta"
                onClick={handleLogout}
              >
                Logout <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-link">
                <UserRound size={18} />
                Login
              </Link>

              <Link to="/register" className="btn btn-primary nav-cta">
                Get Started <ArrowRight size={16} />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
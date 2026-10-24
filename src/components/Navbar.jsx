import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Properties", path: "/properties" },
    { name: "Favorites", path: "/favorites" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("havenlyLoggedIn");
    localStorage.removeItem("havenlyRememberMe");
    localStorage.removeItem("havenlyToken");

    if (onLogout) {
      onLogout();
    }

    setMenuOpen(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="logo" onClick={closeMenu}>
          Havenly
        </Link>

        <div className="nav-links desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={isActive(link.path) ? "active" : ""}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="nav-actions desktop-actions">
          {user ? (
            <>
              <span className="nav-user">
                Welcome <strong>{user.name || "User"}</strong>
              </span>

              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="sign-in">
                Sign in
              </Link>

              <Link to="/register" className="list-property">
                Create account
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={isActive(link.path) ? "active" : ""}
                onClick={closeMenu}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="mobile-actions">
            {user ? (
              <>
                <div className="mobile-user">
                  Welcome <strong>{user.name || "User"}</strong>
                </div>

                <button
                  type="button"
                  className="mobile-logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="mobile-sign-in"
                  onClick={closeMenu}
                >
                  Sign in
                </Link>

                <Link
                  to="/register"
                  className="mobile-register"
                  onClick={closeMenu}
                >
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
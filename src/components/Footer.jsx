import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Mail,
  MapPin,
} from "lucide-react";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              Havenly
            </Link>

            <p>
              Discover a place that feels like home.
              Explore beautiful properties and find the
              right space for your lifestyle.
            </p>

            <div className="footer-contact">
              <a href="mailto:zohaibawan6986@gmail.com">
                <Mail size={15} />
                zohaibawan6986@gmail.com
              </a>

              <span>
                <MapPin size={15} />
                Pakistan
              </span>
            </div>
          </div>

          <div className="footer-column">
            <h3>Explore</h3>

            <Link to="/">Home</Link>

            <Link to="/properties">
              Properties
            </Link>

            <Link to="/favorites">
              Favorites
            </Link>

            <Link to="/contact">
              Contact
            </Link>
          </div>

          <div className="footer-column">
            <h3>Account</h3>

            <Link to="/login">
              Sign In
            </Link>

            <Link to="/register">
              Create Account
            </Link>
          </div>

          <div className="footer-column footer-cta">
            <h3>Find your place.</h3>

            <p>
              Start exploring properties and discover
              your next home.
            </p>

            <Link
              to="/properties"
              className="footer-button"
            >
              Explore Properties
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © 2026 Havenly. Zohaib Ahmed Awan
          </p>

          <p>
            Designed by Zohaib
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
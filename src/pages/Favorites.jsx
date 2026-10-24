import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Lock } from "lucide-react";

import PropertyCard from "../components/PropertyCard";

function Favorites({ favorites, onFavorite, user }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "https://havenly-backend-qp1x.onrender.com/api/properties"
        );

        if (!response.ok) {
          throw new Error("Failed to load properties.");
        }

        const result = await response.json();

        setProperties(
          Array.isArray(result.data) ? result.data : []
        );
      } catch (err) {
        setError(
          "Properties load nahi ho sakin. Please backend check karo."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (!user) {
    return (
      <main className="page-section favorites-page">
        <div className="container">
          <div className="empty-state">
            <Lock size={42} strokeWidth={1.4} />

            <span className="section-eyebrow">
              HAVENLY ACCOUNT
            </span>

            <h2>Sign in to view favorites</h2>

            <p>
              Create an account or sign in to save and
              manage your favorite properties.
            </p>

            <div className="empty-state-actions">
              <Link to="/login" className="primary-button">
                Sign In
              </Link>

              <Link
                to="/register"
                className="secondary-button"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const favoriteProperties = properties.filter((property) =>
    favorites.some(
      (favoriteId) =>
        String(favoriteId) === String(property._id) ||
        String(favoriteId) === String(property.id)
    )
  );

  return (
    <main className="page-section favorites-page">
      <div className="container">
        <div className="page-header">
          <span className="section-eyebrow">
            SAVED PROPERTIES
          </span>

          <h1>Your Favorites</h1>

          <p>
            Keep track of the properties you are
            interested in.
          </p>
        </div>

        {loading ? (
          <div className="empty-state">
            <p>Loading your favorite properties...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <p>{error}</p>
          </div>
        ) : favoriteProperties.length === 0 ? (
          <div className="empty-state">
            <Heart size={42} strokeWidth={1.4} />

            <h2>No saved properties yet</h2>

            <p>
              When you find a property you like, tap the
              heart icon to save it here.
            </p>

            <Link
              to="/properties"
              className="primary-button"
            >
              Explore Properties
            </Link>
          </div>
        ) : (
          <>
            <div className="favorites-count">
              <strong>{favoriteProperties.length}</strong>

              <span>
                {favoriteProperties.length === 1
                  ? " saved property"
                  : " saved properties"}
              </span>
            </div>

            <div className="property-grid">
              {favoriteProperties.map((property) => (
                <PropertyCard
                  key={property._id || property.id}
                  property={property}
                  isFavorite={true}
                  onFavorite={onFavorite}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default Favorites;
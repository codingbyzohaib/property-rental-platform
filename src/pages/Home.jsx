import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Search,
  ShieldCheck,
  Heart,
  Home as HomeIcon,
  MapPin,
} from "lucide-react";

import PropertyCard from "../components/PropertyCard";

const API_URL = "https://havenly-backend-qp1x.onrender.com/api/properties";

function Home({ favorites = [], onFavorite }) {
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [budget, setBudget] = useState("");

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFeaturedProperties = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success || !Array.isArray(result.data)) {
        throw new Error("Invalid properties response.");
      }

      const formattedProperties = result.data.map((property) => ({
        ...property,
        id: property._id || property.id,
        type: property.propertyType || property.type || "",
      }));

      setProperties(formattedProperties);
    } catch (err) {
      console.error("Home Properties API Error:", err);
      setError(
        err.message ||
          "Properties load nahi ho sakin. Please dobara try karein."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (location.trim()) {
      params.set("location", location.trim());
    }

    if (type) {
      params.set("type", type);
    }

    if (budget) {
      params.set("budget", budget);
    }

    const query = params.toString();

    navigate(query ? `/properties?${query}` : "/properties");
  };

  const featuredProperties = properties
    .filter((property) => property.featured === true)
    .concat(
      properties.filter((property) => property.featured !== true)
    )
    .slice(0, 3);

  const popularLocations = ["Lahore", "Islamabad", "Karachi"];

  return (
    <main>
      <section className="hero">
        <div className="hero-overlay"></div>

        <div className="container hero-content">
          <span className="hero-eyebrow">
            YOUR NEXT PLACE STARTS HERE
          </span>

          <h1>Find a place you'll love to call home.</h1>

          <p>
            Discover beautiful homes and apartments in
            locations that fit your lifestyle.
          </p>

          <form className="hero-search" onSubmit={handleSearch}>
            <div className="search-field">
              <label>Location</label>
              <input
                type="text"
                placeholder="City or area"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="search-field">
              <label>Property Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">All types</option>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
              </select>
            </div>

            <div className="search-field">
              <label>Budget</label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              >
                <option value="">Any budget</option>
                <option value="50000">Up to PKR 50,000</option>
                <option value="80000">Up to PKR 80,000</option>
                <option value="100000">Up to PKR 100,000</option>
                <option value="150000">Up to PKR 150,000</option>
              </select>
            </div>

            <button type="submit" className="search-button">
              <Search size={18} />
              Search
            </button>
          </form>

          <div className="hero-popular">
            <span>Popular:</span>

            {popularLocations.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => {
                  setLocation(city);
                  navigate(
                    `/properties?location=${encodeURIComponent(city)}`
                  );
                }}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="stats-strip">
        <div className="container stats-grid">
          <div>
            <strong>{properties.length}</strong>
            <span>Properties</span>
          </div>

          <div>
            <strong>{popularLocations.length}</strong>
            <span>Popular Cities</span>
          </div>

          <div>
            <strong>1,000+</strong>
            <span>Happy Users</span>
          </div>

          <div>
            <strong>24/7</strong>
            <span>Support</span>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">
                HANDPICKED FOR YOU
              </span>

              <h2>Featured properties</h2>

              <p>
                Explore some of our most desirable properties.
              </p>
            </div>

            <Link to="/properties" className="text-link">
              View all
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="empty-state">
              <h2>Loading featured properties...</h2>
              <p>Please wait while we fetch available properties.</p>
            </div>
          ) : error ? (
            <div className="empty-state">
              <h2>Unable to load properties</h2>
              <p>{error}</p>

              <button
                type="button"
                className="primary-button"
                onClick={fetchFeaturedProperties}
              >
                Try Again
              </button>
            </div>
          ) : featuredProperties.length > 0 ? (
            <div className="property-grid">
              {featuredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isFavorite={favorites.some(
                    (favorite) =>
                      String(
                        typeof favorite === "object"
                          ? favorite.id || favorite._id
                          : favorite
                      ) === String(property.id)
                  )}
                  onFavorite={onFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>No properties available yet</h2>
              <p>
                Check back soon for available Havenly properties.
              </p>

              <Link to="/properties" className="primary-button">
                Explore All Properties
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="page-section why-section">
        <div className="container">
          <div className="section-heading centered">
            <span className="section-eyebrow">WHY HAVENLY</span>

            <h2>A simpler way to find your next home.</h2>

            <p>
              Everything you need to discover a property that feels
              right.
            </p>
          </div>

          <div className="why-grid">
            <div className="why-card">
              <div className="why-number">
                <HomeIcon size={22} />
              </div>

              <h3>Curated Properties</h3>

              <p>
                Explore carefully selected homes and apartments
                across popular locations.
              </p>
            </div>

            <div className="why-card">
              <div className="why-number">
                <ShieldCheck size={22} />
              </div>

              <h3>Simple and Transparent</h3>

              <p>
                Get clear property information, pricing, amenities
                and specifications in one place.
              </p>
            </div>

            <div className="why-card">
              <div className="why-number">
                <Heart size={22} />
              </div>

              <h3>Save Your Favorites</h3>

              <p>
                Save properties you love and easily come back to
                them whenever you need.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">
                EXPLORE BY LOCATION
              </span>

              <h2>Popular cities</h2>

              <p>
                Start your search in one of our popular locations.
              </p>
            </div>
          </div>

          <div className="why-grid">
            {popularLocations.map((city) => (
              <button
                key={city}
                type="button"
                className="why-card"
                onClick={() =>
                  navigate(
                    `/properties?location=${encodeURIComponent(city)}`
                  )
                }
              >
                <div className="why-number">
                  <MapPin size={22} />
                </div>

                <h3>{city}</h3>

                <p>Explore available properties in {city}.</p>

                <span className="text-link">
                  Explore
                  <ArrowRight size={16} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-content">
          <div>
            <span className="section-eyebrow">
              READY TO FIND YOUR PLACE?
            </span>

            <h2>
              Your next home could be closer than you think.
            </h2>

            <p>
              Start exploring properties and find a place that feels
              like home.
            </p>
          </div>

          <Link to="/properties" className="cta-button">
            Explore Properties
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;
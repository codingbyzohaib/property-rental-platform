import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  SlidersHorizontal,
  X,
  Search,
  MapPin,
} from "lucide-react";

import PropertyCard from "../components/PropertyCard";

function Properties({ favorites, onFavorite }) {
  const [searchParams] = useSearchParams();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [location, setLocation] = useState(
    searchParams.get("location") || ""
  );

  const [type, setType] = useState(
    searchParams.get("type") || ""
  );

  const [bedrooms, setBedrooms] = useState("");

  const [budget, setBudget] = useState(
    searchParams.get("budget") || ""
  );

  const [sort, setSort] = useState("default");
  const [mobileFilters, setMobileFilters] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "https://havenly-backend-qp1x.onrender.com/api/properties"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch properties.");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error("Could not load properties.");
        }

        const formattedProperties = result.data.map(
          (property) => ({
            ...property,
            id: property._id,
            type: property.propertyType,
          })
        );

        setProperties(formattedProperties);
      } catch (err) {
        console.error("Properties API Error:", err);
        setError(
          "Properties load nahi ho sakin. Please backend server check karke dobara try karein."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const filteredProperties = useMemo(() => {
    let result = [...properties];

    if (location.trim()) {
      const searchLocation = location.toLowerCase();

      result = result.filter((property) =>
        `${property.location} ${property.city}`
          .toLowerCase()
          .includes(searchLocation)
      );
    }

    if (type) {
      result = result.filter(
        (property) => property.type === type
      );
    }

    if (bedrooms) {
      result = result.filter(
        (property) =>
          property.bedrooms >= Number(bedrooms)
      );
    }

    if (budget) {
      result = result.filter(
        (property) =>
          property.price <= Number(budget)
      );
    }

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "beds") {
      result.sort((a, b) => b.bedrooms - a.bedrooms);
    }

    return result;
  }, [properties, location, type, bedrooms, budget, sort]);

  const clearFilters = () => {
    setLocation("");
    setType("");
    setBedrooms("");
    setBudget("");
    setSort("default");
  };

  const hasFilters = location || type || bedrooms || budget;

  return (
    <main className="properties-page">
      <div className="container">
        <div className="properties-header">
          <div>
            <span className="section-eyebrow">
              FIND YOUR NEXT PLACE
            </span>

            <h1>Explore Properties</h1>

            <p>
              Browse homes and apartments available for rent.
            </p>
          </div>

          <button
            type="button"
            className="mobile-filter-button"
            onClick={() => setMobileFilters(true)}
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>
        </div>

        <div className="properties-layout">
          <aside
            className={`filters-sidebar ${
              mobileFilters ? "mobile-open" : ""
            }`}
          >
            <div className="filters-header">
              <div>
                <span className="section-eyebrow">
                  REFINE
                </span>

                <h3>Filters</h3>
              </div>

              <button
                type="button"
                className="close-filter-button"
                onClick={() => setMobileFilters(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="filter-group">
              <label>Location</label>

              <div className="filter-input">
                <MapPin size={16} />

                <input
                  type="text"
                  placeholder="City or area"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Property Type</label>

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Minimum Bedrooms</label>

              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
              >
                <option value="">Any</option>
                <option value="1">1+ Bedrooms</option>
                <option value="2">2+ Bedrooms</option>
                <option value="3">3+ Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
                <option value="5">5+ Bedrooms</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Maximum Budget</label>

              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              >
                <option value="">Any Budget</option>
                <option value="50000">PKR 50,000</option>
                <option value="80000">PKR 80,000</option>
                <option value="100000">PKR 100,000</option>
                <option value="150000">PKR 150,000</option>
              </select>
            </div>

            <button
              type="button"
              className="clear-filters"
              onClick={clearFilters}
            >
              Clear All Filters
            </button>
          </aside>

          {mobileFilters && (
            <button
              type="button"
              className="filter-overlay"
              onClick={() => setMobileFilters(false)}
              aria-label="Close filters"
            />
          )}

          <div className="properties-results">
            <div className="results-toolbar">
              <div className="results-count">
                <strong>
                  {loading ? "..." : filteredProperties.length}
                </strong>

                <span>
                  {filteredProperties.length === 1
                    ? " property found"
                    : " properties found"}
                </span>
              </div>

              <select
                className="sort-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="default">Sort by</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="beds">Most Bedrooms</option>
              </select>
            </div>

            {hasFilters && (
              <div className="active-filters">
                <span>Active filters:</span>

                {location && (
                  <button
                    type="button"
                    onClick={() => setLocation("")}
                  >
                    <Search size={13} />
                    {location}
                    <X size={13} />
                  </button>
                )}

                {type && (
                  <button
                    type="button"
                    onClick={() => setType("")}
                  >
                    {type}
                    <X size={13} />
                  </button>
                )}

                {bedrooms && (
                  <button
                    type="button"
                    onClick={() => setBedrooms("")}
                  >
                    {bedrooms}+ beds
                    <X size={13} />
                  </button>
                )}

                {budget && (
                  <button
                    type="button"
                    onClick={() => setBudget("")}
                  >
                    Up to PKR {Number(budget).toLocaleString()}
                    <X size={13} />
                  </button>
                )}

                <button type="button" onClick={clearFilters}>
                  Clear
                </button>
              </div>
            )}

            {loading ? (
              <div className="empty-state">
                <h2>Loading properties...</h2>
                <p>Please wait while we fetch available properties.</p>
              </div>
            ) : error ? (
              <div className="empty-state">
                <h2>Unable to load properties</h2>
                <p>{error}</p>

                <button
                  type="button"
                  className="primary-button"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            ) : filteredProperties.length > 0 ? (
              <div className="property-grid">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    isFavorite={favorites.includes(property.id)}
                    onFavorite={onFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Search size={40} strokeWidth={1.5} />

                <h2>No properties found</h2>

                <p>
                  Try changing your search or filters to find more
                  properties.
                </p>

                <button
                  type="button"
                  className="primary-button"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Properties;
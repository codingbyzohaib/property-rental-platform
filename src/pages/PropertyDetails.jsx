import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Check,
  Heart,
  MapPin,
  Maximize,
} from "lucide-react";

function PropertyDetails({
  favorites = [],
  onFavorite,
}) {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");
        
const response = await fetch(
  `https://havenly-backend-qp1x.onrender.com/api/properties/${id}`
);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Unable to load property."
          );
        }

        const item = result.data;

        setProperty({
          ...item,
          id: item._id || item.id,
          title: item.title || item.name || "Untitled Property",
          image:
            item.image ||
            item.images?.[0] ||
            "",
          location:
            item.location ||
            item.address ||
            "Location unavailable",
          bedrooms: item.bedrooms ?? item.beds ?? 0,
          bathrooms: item.bathrooms ?? item.baths ?? 0,
          area: item.area ?? item.areaSqFt ?? 0,
          price: Number(item.price ?? 0),
          featured: item.featured ?? false,
          purpose: item.purpose || "For Rent",
          description:
            item.description ||
            "Contact Havenly to learn more about this property.",
          amenities: Array.isArray(item.amenities)
            ? item.amenities
            : [],
        });
      } catch (err) {
        console.error("Property Details API Error:", err);
        setError(err.message);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <main className="page-section">
        <div className="container">
          <div className="empty-state">
            <h2>Loading property...</h2>
            <p>Please wait while we load the property details.</p>
          </div>
        </div>
      </main>
    );
  }

  if (!property) {
    return (
      <main className="page-section">
        <div className="container">
          <div className="empty-state">
            <h2>Property not found</h2>

            <p>
              {error ||
                "The property you're looking for is no longer available."}
            </p>

            <Link
              to="/properties"
              className="primary-button"
            >
              Browse Properties
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isFavorite = favorites.some(
    (favorite) =>
      String(favorite) === String(property.id)
  );

  return (
    <main className="property-details-page">
      <div className="container">
        <Link
          to="/properties"
          className="back-link"
        >
          <ArrowLeft size={17} />
          Back to Properties
        </Link>

        <div className="details-image-wrapper">
          <img
            src={property.image}
            alt={property.title}
          />

          <div className="details-badges">
            {property.featured && (
              <span className="featured-badge">
                Featured
              </span>
            )}

            <span className="purpose-badge">
              {property.purpose}
            </span>
          </div>

          <button
            type="button"
            className={`details-favorite ${
              isFavorite ? "liked" : ""
            }`}
            onClick={() => onFavorite?.(property.id)}
            aria-label={
              isFavorite
                ? "Remove from favorites"
                : "Add to favorites"
            }
          >
            <Heart
              size={21}
              fill={
                isFavorite
                  ? "currentColor"
                  : "none"
              }
            />
          </button>
        </div>

        <div className="details-layout">
          <div className="details-main">
            <div className="details-location">
              <MapPin size={17} />
              {property.location}
            </div>

            <h1>{property.title}</h1>

            <div className="details-price">
              <strong>
                PKR {property.price.toLocaleString("en-PK")}
              </strong>

              <span>/ month</span>
            </div>

            <div className="details-specs">
              <div>
                <BedDouble size={20} />

                <span>
                  <strong>{property.bedrooms}</strong>
                  Bedrooms
                </span>
              </div>

              <div>
                <Bath size={20} />

                <span>
                  <strong>{property.bathrooms}</strong>
                  Bathrooms
                </span>
              </div>

              <div>
                <Maximize size={20} />

                <span>
                  <strong>{property.area}</strong>
                  Sq Ft
                </span>
              </div>
            </div>

            <section className="details-section">
              <span className="section-eyebrow">
                PROPERTY OVERVIEW
              </span>

              <h2>About this property</h2>

              <p>{property.description}</p>
            </section>

            <section className="details-section">
              <span className="section-eyebrow">
                WHAT'S INCLUDED
              </span>

              <h2>Amenities</h2>

              <div className="amenities-grid">
                {property.amenities.map((amenity) => (
                  <div
                    className="amenity-item"
                    key={amenity}
                  >
                    <Check size={16} />
                    {amenity}
                  </div>
                ))}
              </div>
            </section>

            <section className="details-section">
              <span className="section-eyebrow">
                LOCATION
              </span>

              <h2>Explore the area</h2>

              <div className="location-map">
                <MapPin size={28} />

                <span>{property.location}</span>
              </div>
            </section>
          </div>

          <aside className="inquiry-card">
            <span className="section-eyebrow">
              INTERESTED?
            </span>

            <h2>Want to know more?</h2>

            <p>
              Send us an inquiry and get more information
              about this property.
            </p>

            <a
              href={`mailto:zohaibawan6986@gmail.com?subject=${encodeURIComponent(
                `Inquiry about ${property.title}`
              )}`}
              className="primary-button inquiry-button"
            >
              Send Inquiry
            </a>

            <Link
              to="/contact"
              className="secondary-button contact-havenly-button"
            >
              Contact Havenly
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default PropertyDetails;
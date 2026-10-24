import { Link } from "react-router-dom";
import {
  Bath,
  BedDouble,
  Heart,
  MapPin,
  Maximize,
  ArrowUpRight,
} from "lucide-react";

function PropertyCard({
  property,
  isFavorite,
  onFavorite,
}) {
  const propertyId = property._id || property.id;

  const price = Number(property.price || 0);

  return (
    <article className="property-card">
      <div className="property-image-wrapper">
        <Link to={`/properties/${propertyId}`}>
          <img
            src={property.image}
            alt={property.title}
          />
        </Link>

        <div className="property-badges">
          {property.featured && (
            <span className="featured-badge">
              Featured
            </span>
          )}

          <span className="purpose-badge">
            {property.purpose || "For Rent"}
          </span>
        </div>

        <button
          type="button"
          className={`favorite-button ${
            isFavorite ? "liked" : ""
          }`}
          onClick={() => onFavorite(propertyId)}
          aria-label={
            isFavorite
              ? "Remove from favorites"
              : "Add to favorites"
          }
        >
          <Heart
            size={19}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="property-card-body">
        <div className="property-location">
          <MapPin size={15} />
          <span>{property.location}</span>
        </div>

        <Link
          to={`/properties/${propertyId}`}
          className="property-title"
        >
          {property.title}
        </Link>

        <div className="property-specs">
          <span>
            <BedDouble size={17} />
            {property.bedrooms} Beds
          </span>

          <span>
            <Bath size={17} />
            {property.bathrooms} Baths
          </span>

          <span>
            <Maximize size={16} />
            {property.area} sq ft
          </span>
        </div>

        <div className="property-card-footer">
          <div className="property-price">
            <strong>
              PKR {price.toLocaleString("en-PK")}
            </strong>

            <small>/ month</small>
          </div>

          <Link
            to={`/properties/${propertyId}`}
            className="view-link"
            aria-label={`View ${property.title}`}
          >
            <span>View</span>
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default PropertyCard;
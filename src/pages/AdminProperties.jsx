import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Building2,
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Star,
  Home,
} from "lucide-react";

import "./AdminProperties.css";

const API_URL = "https://havenly-backend-qp1x.onrender.com/api/properties";

const initialForm = {
  title: "",
  location: "",
  city: "",
  price: "",
  bedrooms: "1",
  bathrooms: "1",
  area: "",
  propertyType: "Apartment",
  image: "",
  description: "",
  featured: false,
};

function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const getHeaders = () => {
    const token = localStorage.getItem("havenlyToken");

    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const fetchProperties = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        headers: getHeaders(),
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Properties load nahi ho sakin."
        );
      }

      const propertyList = Array.isArray(result.data)
        ? result.data
        : Array.isArray(result)
          ? result
          : [];

      setProperties(propertyList);
    } catch (err) {
      setError(
        err.message ||
          "Server se connection nahi ho saka. Backend check karo."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const openAddForm = () => {
    setEditingId(null);
    setForm(initialForm);
    setError("");
    setNotice("");
    setShowForm(true);
  };

  const openEditForm = (property) => {
    setEditingId(property._id);

    setForm({
      title: property.title || "",
      location: property.location || "",
      city: property.city || "",
      price: String(property.price ?? ""),
      bedrooms: String(property.bedrooms ?? 1),
      bathrooms: String(property.bathrooms ?? 1),
      area: String(property.area ?? ""),
      propertyType: property.propertyType || "Apartment",
      image: property.image || "",
      description: property.description || "",
      featured: Boolean(property.featured),
    });

    setError("");
    setNotice("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
    setError("");
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setNotice("");

    if (
      !form.title.trim() ||
      !form.location.trim() ||
      !form.city.trim() ||
      !form.price ||
      !form.area ||
      !form.description.trim()
    ) {
      setError("Please tamam required fields fill karo.");
      return;
    }

    const price = Number(form.price);
    const bedrooms = Number(form.bedrooms);
    const bathrooms = Number(form.bathrooms);
    const area = Number(form.area);

    if (
      !Number.isFinite(price) ||
      !Number.isFinite(bedrooms) ||
      !Number.isFinite(bathrooms) ||
      !Number.isFinite(area) ||
      price <= 0 ||
      bedrooms < 0 ||
      bathrooms < 0 ||
      area <= 0
    ) {
      setError("Price aur area positive honay chahiye.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      location: form.location.trim(),
      city: form.city.trim(),
      price,
      bedrooms,
      bathrooms,
      area,
      propertyType: form.propertyType,
      image: form.image.trim(),
      description: form.description.trim(),
      featured: form.featured,
    };

    setSaving(true);

    try {
      const isEditing = Boolean(editingId);

      const response = await fetch(
        isEditing ? `${API_URL}/${editingId}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: getHeaders(),
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message ||
            `Property ${isEditing ? "update" : "add"} nahi ho saki.`
        );
      }

      setNotice(
        isEditing
          ? "Property successfully update ho gayi."
          : "New property successfully add ho gayi."
      );

      setShowForm(false);
      setEditingId(null);
      setForm(initialForm);

      await fetchProperties();
    } catch (err) {
      setError(
        err.message || "Request complete nahi ho saki."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (property) => {
    const confirmed = window.confirm(
      `Kya tum "${property.title}" ko permanently delete karna chahte ho?`
    );

    if (!confirmed) return;

    setDeletingId(property._id);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`${API_URL}/${property._id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Property delete nahi ho saki."
        );
      }

      setProperties((previous) =>
        previous.filter((item) => item._id !== property._id)
      );

      setNotice("Property successfully delete ho gayi.");

      if (editingId === property._id) {
        setShowForm(false);
        setEditingId(null);
        setForm(initialForm);
      }
    } catch (err) {
      setError(
        err.message || "Property delete karte waqt error aaya."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProperties = properties.filter((property) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return [
      property.title,
      property.location,
      property.city,
      property.propertyType,
    ].some((value) =>
      String(value || "").toLowerCase().includes(query)
    );
  });

  const formatPrice = (price) =>
    `PKR ${Number(price || 0).toLocaleString("en-PK")}`;

  return (
    <div className="admin-properties">
      <section className="ap-page-intro">
        <div>
          <p className="ap-eyebrow">PROPERTY MANAGEMENT</p>
          <h2>Manage Properties</h2>
          <p className="ap-intro-text">
            Havenly ki rental listings ko yahan se manage karo.
          </p>
        </div>

        <button
          type="button"
          className="ap-add-btn"
          onClick={openAddForm}
        >
          <Plus size={18} />
          Add Property
        </button>
      </section>

      {error && (
        <div className="ap-alert ap-alert-error">
          <AlertCircle size={19} />
          <p>{error}</p>

          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {notice && (
        <div className="ap-alert ap-alert-success">
          <CheckCircle2 size={19} />
          <p>{notice}</p>

          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss message"
          >
            <X size={17} />
          </button>
        </div>
      )}

      <section className="ap-toolbar">
        <div className="ap-property-count">
          <div className="ap-count-icon">
            <Building2 size={22} />
          </div>

          <div>
            <span>Total Properties</span>
            <strong>{properties.length}</strong>
          </div>
        </div>

        <label className="ap-search">
          <Search size={18} />

          <input
            type="search"
            placeholder="Search properties..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </label>

        <button
          type="button"
          className="ap-refresh-btn"
          onClick={fetchProperties}
          disabled={loading}
          aria-label="Refresh properties"
          title="Refresh properties"
        >
          <RefreshCw
            size={18}
            className={loading ? "ap-spinning" : ""}
          />
        </button>
      </section>

      {showForm && (
        <section className="ap-form-panel">
          <div className="ap-form-heading">
            <div>
              <p className="ap-eyebrow">
                {editingId ? "UPDATE LISTING" : "NEW LISTING"}
              </p>

              <h3>
                {editingId ? "Edit Property" : "Add New Property"}
              </h3>

              <p>
                Property ki details fill karo aur save kar do.
              </p>
            </div>

            <button
              type="button"
              className="ap-close-btn"
              onClick={closeForm}
              disabled={saving}
              aria-label="Close property form"
            >
              <X size={20} />
            </button>
          </div>

          <form className="ap-form" onSubmit={handleSubmit}>
            <label className="ap-field ap-field-full">
              <span>Property Title *</span>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Luxury Modern Apartment"
                required
              />
            </label>

            <label className="ap-field">
              <span>Location / Area *</span>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. DHA Phase 6"
                required
              />
            </label>

            <label className="ap-field">
              <span>City *</span>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="e.g. Lahore"
                required
              />
            </label>

            <label className="ap-field">
              <span>Monthly Rent (PKR) *</span>
              <input
                name="price"
                type="number"
                min="1"
                value={form.price}
                onChange={handleChange}
                placeholder="85000"
                required
              />
            </label>

            <label className="ap-field">
              <span>Property Type *</span>
              <select
                name="propertyType"
                value={form.propertyType}
                onChange={handleChange}
              >
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Villa">Villa</option>
                <option value="Studio">Studio</option>
              </select>
            </label>

            <label className="ap-field">
              <span>Bedrooms *</span>
              <input
                name="bedrooms"
                type="number"
                min="0"
                value={form.bedrooms}
                onChange={handleChange}
                required
              />
            </label>

            <label className="ap-field">
              <span>Bathrooms *</span>
              <input
                name="bathrooms"
                type="number"
                min="0"
                value={form.bathrooms}
                onChange={handleChange}
                required
              />
            </label>

            <label className="ap-field">
              <span>Area (sq ft) *</span>
              <input
                name="area"
                type="number"
                min="1"
                value={form.area}
                onChange={handleChange}
                placeholder="1800"
                required
              />
            </label>

            <label className="ap-field ap-field-full">
              <span>Image URL</span>
              <input
                name="image"
                type="url"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/property.jpg"
              />
              <small>
                Direct image URL enter karo. Image upload feature abhi
                included nahi hai.
              </small>
            </label>

            <label className="ap-field ap-field-full">
              <span>Description *</span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Property ki details likho..."
                rows="4"
                required
              />
            </label>

            <label className="ap-featured-field">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
              />

              <span>
                <Star size={16} />
                Featured Property
              </span>
            </label>

            <div className="ap-form-actions">
              <button
                type="button"
                className="ap-cancel-btn"
                onClick={closeForm}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="ap-save-btn"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <RefreshCw size={17} className="ap-spinning" />
                    Saving...
                  </>
                ) : (
                  <>
                    {editingId ? (
                      <Pencil size={17} />
                    ) : (
                      <Plus size={18} />
                    )}

                    {editingId ? "Update Property" : "Save Property"}
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="ap-listing-section">
        <div className="ap-listing-heading">
          <div>
            <p className="ap-eyebrow">YOUR LISTINGS</p>
            <h3>All Properties</h3>
          </div>

          <span className="ap-results-count">
            {filteredProperties.length}{" "}
            {filteredProperties.length === 1 ? "listing" : "listings"}
          </span>
        </div>

        {loading ? (
          <div className="ap-state">
            <RefreshCw size={27} className="ap-spinning" />
            <p>Loading properties...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="ap-state">
            <div className="ap-state-icon">
              <Home size={29} />
            </div>

            <h4>
              {search ? "No matching properties" : "No properties found"}
            </h4>

            <p>
              {search
                ? "Search term change karke dobara try karo."
                : "Apni pehli property add karne ke liye button use karo."}
            </p>

            {!search && (
              <button
                type="button"
                className="ap-add-btn"
                onClick={openAddForm}
              >
                <Plus size={17} />
                Add Property
              </button>
            )}
          </div>
        ) : (
          <div className="ap-property-grid">
            {filteredProperties.map((property) => (
              <article className="ap-property-card" key={property._id}>
                <div className="ap-property-image">
                  {property.image ? (
                    <img
                      src={property.image}
                      alt={property.title}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  ) : null}

                  <div
                    className="ap-image-fallback"
                    aria-hidden="true"
                  >
                    <Building2 size={38} />
                  </div>

                  <span className="ap-type-badge">
                    {property.propertyType || "Property"}
                  </span>

                  {property.featured && (
                    <span className="ap-featured-badge">
                      <Star size={12} />
                      Featured
                    </span>
                  )}
                </div>

                <div className="ap-property-body">
                  <div className="ap-property-location">
                    <MapPin size={14} />
                    <span>
                      {[property.location, property.city]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>

                  <h4>{property.title}</h4>

                  <p className="ap-property-price">
                    {formatPrice(property.price)}
                    <span> / month</span>
                  </p>

                  <div className="ap-property-features">
                    <span>
                      <BedDouble size={15} />
                      {property.bedrooms ?? 0} Beds
                    </span>

                    <span>
                      <Bath size={15} />
                      {property.bathrooms ?? 0} Baths
                    </span>

                    <span>
                      <Maximize size={14} />
                      {Number(property.area || 0).toLocaleString("en-PK")} sq ft
                    </span>
                  </div>

                  <div className="ap-property-actions">
                    <button
                      type="button"
                      className="ap-edit-btn"
                      onClick={() => openEditForm(property)}
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    <button
                      type="button"
                      className="ap-delete-btn"
                      onClick={() => handleDelete(property)}
                      disabled={deletingId === property._id}
                    >
                      {deletingId === property._id ? (
                        <RefreshCw
                          size={15}
                          className="ap-spinning"
                        />
                      ) : (
                        <Trash2 size={15} />
                      )}

                      {deletingId === property._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminProperties;
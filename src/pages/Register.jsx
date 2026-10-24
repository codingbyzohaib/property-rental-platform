import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register({ onRegister }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://havenly-backend-qp1x.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(
          result.message || "Unable to create your account."
        );
        return;
      }

      const loggedInUser = {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
      };

      localStorage.setItem("havenlyToken", result.token);

      localStorage.setItem(
        "havenlyLoggedIn",
        JSON.stringify(loggedInUser)
      );

      if (onRegister) {
        onRegister(loggedInUser);
      }

      navigate("/");
    } catch (error) {
      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create your account</h1>

          <p>
            Start exploring your next place to call home.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="auth-message error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Register;
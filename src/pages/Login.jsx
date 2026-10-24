import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || "Invalid email or password.");
        return;
      }

      const loggedInUser = {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
      };

      localStorage.setItem(
        "havenlyLoggedIn",
        JSON.stringify(loggedInUser)
      );

      localStorage.setItem("havenlyToken", result.token);

      if (rememberMe) {
        localStorage.setItem("havenlyRememberMe", "true");
      } else {
        localStorage.removeItem("havenlyRememberMe");
      }

      if (onLogin) {
        onLogin(loggedInUser);
      }

      navigate("/");
    } catch (err) {
      setError(
        "Unable to connect to the server. Please check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    const email = resetEmail.trim().toLowerCase();

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to send the reset link."
        );
      }

      setMessage(
        result.message ||
          "If an account exists for this email, a password reset link has been sent. Please check your inbox."
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const openForgotPassword = () => {
    setForgotPassword(true);
    setResetEmail(formData.email);
    setError("");
    setMessage("");
  };

  const backToSignIn = () => {
    setForgotPassword(false);
    setError("");
    setMessage("");
    setLoading(false);
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        {forgotPassword ? (
          <>
            <div className="auth-header">
              <h1>Reset password</h1>

              <p>
                Enter your email address and we will send you
                a secure password reset link.
              </p>
            </div>

            <form
              className="auth-form"
              onSubmit={handleResetPassword}
            >
              {error && (
                <div className="auth-message error" role="alert">
                  {error}
                </div>
              )}

              {message && (
                <div
                  className="auth-message success"
                  role="status"
                >
                  {message}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="resetEmail">
                  Email Address
                </label>

                <input
                  id="resetEmail"
                  type="email"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <button
                type="submit"
                className="auth-button"
                disabled={loading}
              >
                {loading ? "Sending Reset Link..." : "Send Reset Link"}
              </button>
            </form>

            <div className="auth-footer">
              <button
                type="button"
                className="auth-text-button"
                onClick={backToSignIn}
              >
                Back to Sign In
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="auth-header">
              <h1>Sign in to Havenly</h1>

              <p>
                Continue exploring your next place to call
                home.
              </p>
            </div>

            <form
              className="auth-form"
              onSubmit={handleLogin}
            >
              {error && (
                <div className="auth-message error" role="alert">
                  {error}
                </div>
              )}

              {message && (
                <div
                  className="auth-message success"
                  role="status"
                >
                  {message}
                </div>
              )}

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
                  autoComplete="email"
                  required
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
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
              </div>

              <div className="auth-options">
                <label className="remember-option">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(e.target.checked)
                    }
                  />

                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  className="forgot-button"
                  onClick={openForgotPassword}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="auth-button"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Don't have an account?{" "}
                <Link to="/register">Create account</Link>
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default Login;
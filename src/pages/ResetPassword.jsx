import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!token || !email) {
      setError("Invalid or expired reset link. Please request a new one.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://havenly-backend-qp1x.onrender.com/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            token,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to reset your password."
        );
      }

      setSuccess(true);

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2500);
    } catch (err) {
      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card reset-password-card">
        <div className="auth-header">
          <h1>
            {success ? "Password Updated" : "Reset Password"}
          </h1>

          <p>
            {success
              ? "Your password has been updated successfully."
              : "Create a new password to securely access your Havenly account."}
          </p>
        </div>

        {error && (
          <div className="auth-message error" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="auth-message success" role="status">
            <CheckCircle size={18} />
            <span>
              Password reset successfully! Redirecting to Sign In...
            </span>
          </div>
        )}

        {!success && (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="reset-password">
                New Password
              </label>

              <input
                id="reset-password"
                type="password"
                placeholder="Enter your new password"
                autoComplete="new-password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                minLength={8}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirm-reset-password">
                Confirm New Password
              </label>

              <input
                id="confirm-reset-password"
                type="password"
                placeholder="Enter your password again"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                minLength={8}
                required
              />
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading
                ? "Updating Password..."
                : "Reset Password"}
            </button>
          </form>
        )}

        <div className="auth-footer">
          Remember your password?{" "}
          <Link to="/login">Sign In</Link>
        </div>
      </div>
    </main>
  );
}

export default ResetPassword;
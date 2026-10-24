import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";

function Contact() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSent(false);

    try {
      const response = await fetch(
        "http://localhost:5000/api/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Message send nahi ho saka."
        );
      }

      setSent(true);

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setError(
        err.message ||
          "Backend se connection nahi ho saka. Please dobara try karein."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contact-page">
      <section className="page-section">
        <div className="container contact-layout">
          <div className="contact-form-card">
            {sent ? (
              <div className="contact-success">
                <CheckCircle size={48} />

                <h2>Message sent!</h2>

                <p>
                  Thanks for reaching out. We'll get back
                  to you soon.
                </p>

                <button
                  type="button"
                  className="primary-button"
                  onClick={() => {
                    setSent(false);
                    setError("");
                  }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                className="contact-form"
                onSubmit={handleSubmit}
              >
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">
                      Your Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your name"
                      value={form.name}
                      onChange={handleChange}
                      maxLength={100}
                      required
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
                      value={form.email}
                      onChange={handleChange}
                      maxLength={254}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">
                    Subject
                  </label>

                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="How can we help?"
                    value={form.subject}
                    onChange={handleChange}
                    maxLength={200}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    placeholder="Write your message..."
                    value={form.message}
                    onChange={handleChange}
                    maxLength={5000}
                    required
                  />
                </div>

                {error && (
                  <p role="alert" style={{ color: "#d93025" }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="auth-button"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Message"}

                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;
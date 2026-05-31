import { useState } from "react";
import "./ContactForm.css";

const ContactForm = ({ car, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api/v1";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/contact-seller`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          carId: car.id,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit contact request");
      }

      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", message: "" });

      if (onSuccess) {
        onSuccess();
      }

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="contact-form-overlay">
        <div className="contact-form-modal">
          <div className="contact-success">
            <div className="success-icon">✓</div>
            <h2>Request Submitted!</h2>
            <p>Thank you for your interest in {car.model}</p>
            <p>The seller will contact you soon.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-form-overlay" onClick={onClose}>
      <div className="contact-form-modal" onClick={(e) => e.stopPropagation()}>
        <button className="contact-close-btn" onClick={onClose}>×</button>

        <div className="contact-form-header">
          <h2>Contact Seller</h2>
          <p className="contact-car-name">{car.year} {car.maker} {car.model}</p>
        </div>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Any questions or additional info?"
              rows="4"
            ></textarea>
          </div>

          {error && <div className="contact-error">{error}</div>}

          <button
            type="submit"
            className="contact-submit-btn"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Send Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;

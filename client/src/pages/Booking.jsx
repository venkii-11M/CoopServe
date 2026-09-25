
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function Booking() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    address: "",
    bookingDate: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      await api.post(
        "/bookings",
        {
          service: serviceId,
          address: formData.address,
          bookingDate: formData.bookingDate,
          description: formData.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Your booking has been submitted!");

      navigate("/my-bookings");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Booking failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="section booking-page">
      <div className="booking-container">
        <p className="services-label">CO-OPSERVE BOOKINGS</p>

        <h1>Book a service</h1>

        <p className="booking-intro">
          Tell us where and when you need help.
          Your booking will be sent to the cooperative.
        </p>

        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}

        <form className="booking-form" onSubmit={handleSubmit}>
          <label htmlFor="address">
            Service address
          </label>

          <textarea
            id="address"
            name="address"
            placeholder="Enter your complete address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            required
          />

          <label htmlFor="bookingDate">
            Preferred date and time
          </label>

          <input
            id="bookingDate"
            type="datetime-local"
            name="bookingDate"
            value={formData.bookingDate}
            onChange={handleChange}
            min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
              .toISOString()
              .slice(0, 16)}
            required
          />

          <label htmlFor="description">
            Describe the work needed
          </label>

          <textarea
            id="description"
            name="description"
            placeholder="For example: kitchen tap is leaking..."
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
          />

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Submitting booking..." : "Confirm booking"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default Booking;
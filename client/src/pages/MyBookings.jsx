
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBookings() {
      const token = sessionStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await api.get("/bookings/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const bookingData = Array.isArray(response.data)
          ? response.data
          : response.data.bookings;

        if (Array.isArray(bookingData)) {
          setBookings(bookingData);
        } else {
          setError("Could not read your bookings.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Could not load bookings. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [navigate]);

  return (
    <main className="section my-bookings-page">
      <div className="my-bookings-heading">
        <p className="services-label">YOUR CO-OPSERVE ACCOUNT</p>
        <h1>My Bookings</h1>
        <p>
          Track your household service requests
          and check their current status.
        </p>
      </div>

      {loading && <p>Loading your bookings...</p>}

      {error && (
        <div className="auth-error" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="no-bookings">
          <h3>No bookings yet</h3>
          <p>
            When you book a service, it will appear here.
          </p>
          <Link to="/services" className="auth-submit">
            Explore services
          </Link>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="my-bookings-list">
          {bookings.map((booking) => (
            <div className="my-booking-card" key={booking._id}>
              <div className="my-booking-top">
                <div>
                  <span className="service-category">
                    {booking.service?.category || "Household service"}
                  </span>

                  <h3>
                    {booking.service?.name || "Service"}
                  </h3>
                </div>

                <span
                  className={`booking-status ${
                    booking.status?.toLowerCase()
                  }`}
                >
                  {booking.status}
                </span>
              </div>

              <p className="my-booking-description">
                {booking.description}
              </p>

              <div className="my-booking-details">
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(booking.bookingDate).toLocaleString()}
                </p>

                <p>
                  <strong>Address:</strong> {booking.address}
                </p>

                <p>
                  <strong>Amount:</strong> ₹{booking.totalPrice}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default MyBookings;
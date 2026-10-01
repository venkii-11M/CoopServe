
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [selectedWorkers, setSelectedWorkers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [assigning, setAssigning] = useState("");

  const token = sessionStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");

    if (!token || !savedUser) {
      navigate("/login", { replace: true });
      return;
    }

    let user;

    try {
      user = JSON.parse(savedUser);
    } catch {
      navigate("/login", { replace: true });
      return;
    }

    if (user.role !== "admin") {
      navigate("/", { replace: true });
      return;
    }

    loadDashboard();
  }, [navigate]);

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const [bookingResponse, workerResponse] =
        await Promise.all([
          api.get("/bookings/admin/pending", { headers }),
          api.get("/users/workers", { headers }),
        ]);

      setBookings(bookingResponse.data.bookings);
      setWorkers(workerResponse.data.workers);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleWorkerChange(bookingId, workerId) {
    setSelectedWorkers((previous) => ({
      ...previous,
      [bookingId]: workerId,
    }));
  }

  async function handleAssign(bookingId) {
    const workerId = selectedWorkers[bookingId];

    if (!workerId) {
      setError("Please select a worker first.");
      return;
    }

    setError("");
    setSuccess("");
    setAssigning(bookingId);

    try {
      const response = await api.put(
        "/bookings/assign",
        {
          bookingId,
          workerId,
        },
        { headers }
      );

      setSuccess(response.data.message);

      // Refresh pending bookings after assignment
      await loadDashboard();

      setSelectedWorkers((previous) => ({
        ...previous,
        [bookingId]: "",
      }));
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to assign worker."
      );
    } finally {
      setAssigning("");
    }
  }

  if (loading) {
    return <p>Loading admin dashboard...</p>;
  }

  return (
    <div className="page-container">
      <h1>Admin Dashboard</h1>

      <p>
        Manage service bookings and worker assignments.
      </p>

      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      {success && (
        <p style={{ color: "green" }}>{success}</p>
      )}

      <section>
        <h2>Pending Bookings ({bookings.length})</h2>

        {bookings.length === 0 ? (
          <p>No pending bookings found.</p>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "16px",
              }}
            >
              <h3>{booking.service?.name}</h3>

              <p>
                Customer: {booking.customer?.name}
              </p>

              <p>
                Phone: {booking.customer?.phone}
              </p>

              <p>
                Address: {booking.address}
              </p>

              <p>
                Date:{" "}
                {new Date(
                  booking.bookingDate
                ).toLocaleString()}
              </p>

              <p>Price: ₹{booking.totalPrice}</p>

              <p>Status: {booking.status}</p>

              <label>
                Select Verified Worker
              </label>

              <select
                value={selectedWorkers[booking._id] || ""}
                onChange={(e) =>
                  handleWorkerChange(
                    booking._id,
                    e.target.value
                  )
                }
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px",
                  margin: "8px 0",
                }}
              >
                <option value="">
                  -- Choose a worker --
                </option>

                {workers.map((worker) => (
                  <option
                    key={worker._id}
                    value={worker._id}
                  >
                    {worker.name} - {worker.phone}
                  </option>
                ))}
              </select>

              <button
                onClick={() => handleAssign(booking._id)}
                disabled={
                  !selectedWorkers[booking._id] ||
                  assigning === booking._id
                }
              >
                {assigning === booking._id
                  ? "Assigning..."
                  : "Assign Worker"}
              </button>

              {workers.length === 0 && (
                <p>
                  No verified workers available.
                </p>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { UserRound, Mail, Phone, Lock, ArrowRight } from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer",
    adminCode: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register", formData);

      alert(response.data.message || "Account created successfully!");

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">

        <div className="auth-intro">
          <span className="auth-tag">JOIN YOUR LOCAL COMMUNITY</span>

          <h1>
            Good work starts
            <br />
            <span>with trust.</span>
          </h1>

          <p>
            Create your Co-opServe account to discover trusted
            local services and support your community.
          </p>
        </div>

        <div className="auth-form-section">
          <h2>Create your account</h2>
          <p className="auth-subtitle">
            Enter your details to get started.
          </p>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Full name</label>
            <div className="auth-input">
              <UserRound size={18} />
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <label htmlFor="email">Email address</label>
            <div className="auth-input">
              <Mail size={18} />
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <label htmlFor="phone">Phone number</label>
            <div className="auth-input">
              <Phone size={18} />
              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <label htmlFor="password">Password</label>
            <div className="auth-input">
              <Lock size={18} />
              <input
                id="password"
                type="password"
                name="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                required
              />
            </div>
<label htmlFor="role">Account type</label>
<div className="auth-input">
  <select
    id="role"
    name="role"
    value={formData.role}
    onChange={handleChange}
    required
  >
    <option value="customer">Customer</option>
    <option value="worker">Worker</option>
    <option value="admin">Admin</option>
  </select>
</div>

{formData.role === "admin" && (
  <>
    <label htmlFor="adminCode">Admin Code</label>

    <input
      id="adminCode"
      type="password"
      name="adminCode"
      placeholder="Enter code"
      value={formData.adminCode}
      onChange={handleChange}
      required
    />
  </>
)}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="auth-switch">
            Already a member? <Link to="/login">Sign in</Link>
          </p>
        </div>

      </section>
    </main>
  );
}

export default Register;

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  useEffect(() => {
  const token = sessionStorage.getItem("token");

  if (token) {
    navigate("/services", { replace: true });
  }
}, [navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    try {
      setLoading(true);

      const response = await api.post("/auth/login", formData);

      const { token, user } = response.data;

      // Keep the login session for this browser tab
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));

      navigate("/services");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">

        <div className="auth-intro">
          <span className="auth-tag">WELCOME BACK</span>

          <h1>
            Your community.
            <br />
            <span>Your trusted help.</span>
          </h1>

          <p>
            Sign in to find local service professionals,
            manage your bookings, and stay connected
            with your cooperative community.
          </p>
        </div>

        <div className="auth-form-section">
          <h2>Sign in</h2>

          <p className="auth-subtitle">
            Welcome back to Co-opServe.
          </p>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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

            <label htmlFor="password">Password</label>

            <div className="auth-input">
              <Lock size={18} />

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="auth-switch">
            New to Co-opServe?{" "}
            <Link to="/register">Create an account</Link>
          </p>
        </div>

      </section>
    </main>
  );
}

export default Login;

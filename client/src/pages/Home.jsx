import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ShieldCheck,
  Users,
  Clock,
  ArrowRight,
  Wrench,
  Zap,
  Sparkles,
  Paintbrush,
  TreePine,
  Heart,
} from "lucide-react";

import api from "../services/api";
import ServiceCard from "../components/ServiceCard";

const categories = [
  { name: "Plumbing", icon: Wrench },
  { name: "Electrical", icon: Zap },
  { name: "Cleaning", icon: Sparkles },
  { name: "Painting", icon: Paintbrush },
  { name: "Gardening", icon: TreePine },
  { name: "Home Care", icon: Heart },
];

function Home() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/services");
        setServices(response.data.services);
      } catch (error) {
        console.error("Could not load services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = services.filter((service) =>
    `${service.name} ${service.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <ShieldCheck size={16} />
              Trusted local cooperative services
            </div>

            <h1>
              Your home,
              <br />
              <span>in good hands.</span>
            </h1>

            <p className="hero-description">
              Book trusted local professionals for your everyday
              needs. Supporting skilled workers and stronger
              communities, one service at a time.
            </p>

            <div className="hero-search">
              <Search size={21} />

              <input
                type="text"
                placeholder="What service do you need?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <Link to="/services" className="btn btn-primary">
                Explore <ArrowRight size={17} />
              </Link>
            </div>

            <div className="hero-trust">
              <span>
                <ShieldCheck size={17} /> Verified workers
              </span>

              <span>
                <Users size={17} /> Cooperative owned
              </span>
            </div>
          </div>

          <div className="hero-visual">
            <img
              src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=85"
              alt="Professional electrician working safely"
            />

            <div className="floating-card">
              <div className="floating-icon">
                <Clock size={22} />
              </div>

              <div>
                <strong>Convenient booking</strong>
                <p>Choose a time that works for you</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section categories-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">WHAT WE OFFER</span>
            <h2>How can we help you?</h2>
            <p>Everyday services, delivered by skilled local workers.</p>
          </div>

          <Link to="/services" className="text-link">
            All services <ArrowRight size={17} />
          </Link>
        </div>

        <div className="category-grid">
          {categories.map(({ name, icon: Icon }) => (
            <Link
              to={`/services?category=${encodeURIComponent(name)}`}
              className="category-card"
              key={name}
            >
              <div className="category-icon">
                <Icon size={25} />
              </div>

              <span>{name}</span>

              <ArrowRight className="category-arrow" size={17} />
            </Link>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="section services-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">LOCAL PROFESSIONALS</span>
            <h2>Popular services</h2>
            <p>Find the right help for your home.</p>
          </div>

          <Link to="/services" className="text-link">
            View all <ArrowRight size={17} />
          </Link>
        </div>

        {loading ? (
          <p>Loading services...</p>
        ) : filteredServices.length === 0 ? (
          <div className="empty-state">
            <Wrench size={32} />
            <h3>No services found</h3>
            <p>
              {search
                ? "Try another search term."
                : "Services will appear here once added by your cooperative."}
            </p>
          </div>
        ) : (
          <div className="service-grid">
            {filteredServices.slice(0, 6).map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </section>

      {/* Cooperative banner */}
      <section className="community-banner">
        <div>
          <span className="eyebrow">MORE THAN A SERVICE</span>
          <h2>When you book local, the whole community grows.</h2>
          <p>
            Every booking supports skilled workers and
            cooperative-owned livelihoods.
          </p>
        </div>

        <Link to="/services" className="btn btn-light">
          Book a service <ArrowRight size={17} />
        </Link>
      </section>
    </main>
  );
}

export default Home;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import api from "../services/api";

function Services() {
  // Store services received from the backend
  const [services, setServices] = useState([]);

  // Store the search text
  const [search, setSearch] = useState("");

  // Track loading and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch services when the page opens
  useEffect(() => {
    async function fetchServices() {
      try {
       
const response = await api.get("/services");

setServices(response.data.services);
      } catch (err) {
        setError("Could not load services. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  // Filter services based on the search text
  const filteredServices = services.filter((service) => {
    const searchText = search.toLowerCase();

    return (
      service.name.toLowerCase().includes(searchText) ||
      service.category.toLowerCase().includes(searchText)
    );
  });

  return (
    <main className="section services-page">
      <div className="services-heading">
        <div>
          <p className="services-label">CO-OPSERVE SERVICES</p>
          <h1>Services in your community</h1>
          <p>
            Find local professionals for your household
            and everyday service needs.
          </p>
        </div>
      </div>

      <div className="services-search">
        <Search size={20} />

        <input
          type="text"
          placeholder="Search plumbing, cleaning, electrical..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <p>Loading services...</p>}

      {error && <p className="services-error">{error}</p>}

      {!loading && !error && (
        <>
          <p className="services-count">
            {filteredServices.length} services available
          </p>

          <div className="services-grid">
            {filteredServices.map((service) => (
              <div className="service-item" key={service._id}>
                <span className="service-category">
                  {service.category}
                </span>

                <h3>{service.name}</h3>

                <p className="service-description">
                  {service.description}
                </p>

                <div className="service-details">
                  <span>
                    ₹{service.basePrice}
                  </span>

                  <span>
                    {service.estimatedDuration} minutes
                  </span>
                </div>

                <Link
                  to={`/services/${service._id}/book`}
                  className="service-book-link"
                >
                  Book this service →
                </Link>
              </div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <p className="services-empty">
              No services found. Try another search.
            </p>
          )}
        </>
      )}
    </main>
  );
}

export default Services;
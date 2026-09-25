import { ArrowUpRight } from "lucide-react";

function ServiceCard({ service }) {
  return (
    <article className="service-card">
      <div className="service-card-top">
        <span className="service-category">
          {service.category}
        </span>

        <span className="service-arrow">
          <ArrowUpRight size={20} />
        </span>
      </div>

      <h3>{service.name}</h3>

      <p>{service.description}</p>

      <div className="service-card-bottom">
        <div>
          <span className="muted-text">Starting from</span>
          <h4>₹{service.basePrice}</h4>
        </div>

        <span className="duration">
          {service.estimatedDuration} min
        </span>
      </div>
    </article>
  );
}

export default ServiceCard;
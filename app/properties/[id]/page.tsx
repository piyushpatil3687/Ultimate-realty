"use client";

import { useParams } from "next/navigation";

const property = {
  title: "Premium 3 BHK Apartment",
  type: "Apartment",
  purpose: "For Sale",
  location: "Ravet, Pune",
  price: "₹85 Lakh",
  bhk: "3 BHK",
  area: "1450 sq.ft",
  description:
    "A spacious and modern apartment located in Ravet, Pune. This property is suitable for families looking for a comfortable home with convenient access to major areas of Pune.",
  amenities: [
    "Covered Parking",
    "24/7 Security",
    "Lift",
    "Power Backup",
    "Children's Play Area",
    "Gym",
  ],
};

export default function PropertyDetailsPage() {
  const params = useParams();

  return (
    <main>
      {/* Header */}

      <header className="simple-header">
        <div className="container simple-header-inner">
          <a href="/" className="simple-logo">
            <img
              src="/images/ultimate-realty-logo.png"
              alt="Ultimate Realty UR"
              className="simple-logo-image"
            />

            <div className="simple-logo-text">
              <strong>ULTIMATE REALTY</strong>
              <small>UR • PUNE</small>
            </div>
          </a>

          <nav>
            <a href="/">Home</a>
            <a href="/properties">Properties</a>
            <a href="/services">Services</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </nav>
        </div>
      </header>

      {/* Breadcrumb */}

      <section className="property-breadcrumb">
        <div className="container">
          <a href="/properties">Properties</a>
          <span> / </span>
          <span>{property.title}</span>
        </div>
      </section>

      {/* Main Property */}

      <section className="property-details-section">
        <div className="container">
          <div className="property-details-grid">
            {/* Gallery */}

            <div className="property-gallery">
              <div className="main-property-image">
                <span>PROPERTY MAIN IMAGE</span>

                <small>{property.purpose}</small>
              </div>

              <div className="property-thumbnails">
                <div>IMAGE 1</div>
                <div>IMAGE 2</div>
                <div>IMAGE 3</div>
                <div>IMAGE 4</div>
              </div>
            </div>

            {/* Property Information */}

            <div className="property-main-info">
              <p className="listing-type">{property.type}</p>

              <h1>{property.title}</h1>

              <p className="property-main-location">
                📍 {property.location}
              </p>

              <div className="property-price">{property.price}</div>

              <div className="property-specifications">
                <div>
                  <span>BHK</span>
                  <strong>{property.bhk}</strong>
                </div>

                <div>
                  <span>AREA</span>
                  <strong>{property.area}</strong>
                </div>

                <div>
                  <span>TYPE</span>
                  <strong>{property.type}</strong>
                </div>
              </div>

              <div className="property-action-buttons">
                <a
                  href="tel:+919067513120"
                  className="primary-button"
                >
                  Call Now
                </a>

                <a
                  href={`https://wa.me/919067513120?text=Hello%20Ultimate%20Realty,%20I%20am%20interested%20in%20${encodeURIComponent(
                    property.title
                  )}`}
                  className="whatsapp-button"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Description */}

          <div className="property-information-grid">
            <div>
              <p className="section-label">PROPERTY DESCRIPTION</p>

              <h2>About this property</h2>

              <p className="property-description">
                {property.description}
              </p>
            </div>

            {/* Enquiry */}

            <div className="enquiry-card">
              <p className="section-label">INTERESTED?</p>

              <h3>Send an Enquiry</h3>

              <form>
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                />

                <input
                  type="tel"
                  placeholder="Phone Number"
                  required
                />

                <input
                  type="email"
                  placeholder="Email Address"
                />

                <textarea
                  placeholder="Your Message"
                  rows={4}
                  defaultValue={`I am interested in ${property.title}.`}
                />

                <button type="submit">
                  Send Enquiry →
                </button>
              </form>
            </div>
          </div>

          {/* Amenities */}

          <section className="amenities-section">
            <p className="section-label">PROPERTY FEATURES</p>

            <h2>Amenities</h2>

            <div className="amenities-grid">
              {property.amenities.map((amenity) => (
                <div key={amenity}>✓ {amenity}</div>
              ))}
            </div>
          </section>

          {/* Map */}

          <section className="map-section">
            <p className="section-label">LOCATION</p>

            <h2>Property Location</h2>

            <div className="map-placeholder">
              <div>
                <strong>Google Maps</strong>
                <span>{property.location}, Pune</span>
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* Bottom CTA */}

      <section className="property-contact">
        <div className="container">
          <p className="section-label">ULTIMATE REALTY UR</p>

          <h2>Interested in this property?</h2>

          <p>
            Contact our team for more information,
            property visit and assistance.
          </p>

          <div>
            <a href="tel:+919067513120">
              Call 9067513120
            </a>

            <a href="https://wa.me/919067513120">
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
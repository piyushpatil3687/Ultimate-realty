"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import styles from "./page.module.css";

type Property = {
  id: string;
  title: string;
  property_type: string;
  listing_type: string;
  price: string | null;
  location: string | null;
  city: string | null;
  bhk: string | null;
  carpet_area: string | null;
  built_up_area: string | null;
  images: string[] | null;
};

const categories = [
  {
    title: "Apartments",
    text: "Modern apartments in prime Pune locations.",
    type: "Apartment",
  },
  {
    title: "Flats",
    text: "Comfortable flats for families and professionals.",
    type: "Flat",
  },
  {
    title: "Villas",
    text: "Spacious villas designed for elevated living.",
    type: "Villa",
  },
  {
    title: "Plots",
    text: "Residential and investment plots across Pune.",
    type: "Plot",
  },
];

const services = [
  {
    number: "01",
    title: "Property Buying",
    text: "Find the right property based on your location, budget and lifestyle requirements.",
  },
  {
    number: "02",
    title: "Property Selling",
    text: "Get professional assistance to present and connect your property with genuine buyers.",
  },
  {
    number: "03",
    title: "Property Renting",
    text: "Discover suitable rental properties with guidance throughout the process.",
  },
  {
    number: "04",
    title: "Real Estate Consultation",
    text: "Get practical guidance for property decisions and real-estate investments.",
  },
];

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProperties();
  }, []);

  async function loadFeaturedProperties() {
    setLoading(true);

    const { data, error } = await supabase
      .from("properties")
      .select(
        "id,title,property_type,listing_type,price,location,city,bhk,carpet_area,built_up_area,images"
      )
      .order("created_at", { ascending: false })
      .limit(6);

    if (!error && data) {
      setProperties(data);
    }

    setLoading(false);
  }

  return (
    <main className={styles.page}>
      {/* TOP BAR */}
      <div className={styles.topBar}>
        <div className={styles.container}>
          <span>Trusted Real Estate Services in Pune</span>

          <div className={styles.topLinks}>
            <a href="tel:+919067513120">+91 90675 13120</a>
            <a href="mailto:ultimaterealty711@gmail.com">
              ultimaterealty711@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoMain}>ULTIMATE</span>
            <span className={styles.logoSub}>REALTY UR</span>
          </Link>

          <nav className={styles.nav}>
            <Link href="/" className={styles.active}>
              Home
            </Link>
            <Link href="/properties">Properties</Link>
            <Link href="/about">About Us</Link>
            <Link href="/services">Services</Link>
            <Link href="/contact">Contact Us</Link>
          </nav>

          <Link href="/properties" className={styles.headerButton}>
            Explore Properties
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>

        <div className={styles.container}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>ULTIMATE REALTY UR</p>

            <h1>
              Find a Place
              <br />
              <span>You Can Call Home.</span>
            </h1>

            <p className={styles.heroText}>
              Discover thoughtfully selected properties across Pune with
              trusted guidance from search to possession.
            </p>

            <div className={styles.heroActions}>
              <Link href="/properties" className={styles.primaryButton}>
                Explore Properties
              </Link>

              <Link href="/contact" className={styles.secondaryButton}>
                Talk to an Expert
              </Link>
            </div>
          </div>

          {/* SEARCH BOX */}
          <div className={styles.searchBox}>
            <div className={styles.searchHeading}>
              <span>PROPERTY SEARCH</span>
              <p>Find your ideal property</p>
            </div>

            <div className={styles.searchFields}>
              <Link href="/properties" className={styles.searchField}>
                <span>Location</span>
                <strong>Pune</strong>
              </Link>

              <Link href="/properties" className={styles.searchField}>
                <span>Property Type</span>
                <strong>Any Property</strong>
              </Link>

              <Link href="/properties" className={styles.searchField}>
                <span>Looking For</span>
                <strong>Sale / Rent</strong>
              </Link>

              <Link
                href="/properties"
                className={styles.searchButton}
              >
                Search Properties
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className={styles.introSection}>
        <div className={styles.container}>
          <div className={styles.introGrid}>
            <div>
              <p className={styles.sectionLabel}>WELCOME TO ULTIMATE REALTY</p>

              <h2>
                Real Estate Decisions,
                <br />
                <span>Made With Confidence.</span>
              </h2>
            </div>

            <div className={styles.introText}>
              <p>
                At Ultimate Realty UR, we help home buyers discover properties
                that match their needs, lifestyle and budget.
              </p>

              <p>
                From apartments and flats to villas, plots and commercial
                properties, our focus is to make your real-estate journey
                simple, transparent and stress-free.
              </p>

              <Link href="/about" className={styles.textLink}>
                Discover Our Story →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className={styles.propertiesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionLabel}>OUR PROPERTIES</p>

              <h2>
                Featured <span>Properties</span>
              </h2>
            </div>

            <Link href="/properties" className={styles.viewAll}>
              View All Properties →
            </Link>
          </div>

          {loading ? (
            <div className={styles.loading}>
              Loading properties...
            </div>
          ) : properties.length === 0 ? (
            <div className={styles.emptyProperties}>
              <h3>Properties Coming Soon</h3>
              <p>
                Our latest property listings will appear here.
              </p>

              <Link href="/contact" className={styles.primaryButtonDark}>
                Contact Us
              </Link>
            </div>
          ) : (
            <div className={styles.propertyGrid}>
              {properties.map((property) => {
                const image =
                  property.images && property.images.length > 0
                    ? property.images[0]
                    : "/property-placeholder.jpg";

                return (
                  <Link
                    href={`/properties/${property.id}`}
                    key={property.id}
                    className={styles.propertyCard}
                  >
                    <div className={styles.propertyImageWrap}>
                      <img
                        src={image}
                        alt={property.title}
                        className={styles.propertyImage}
                      />

                      <span
                        className={`${styles.listingBadge} ${
                          property.listing_type?.toLowerCase() === "rent"
                            ? styles.rentBadge
                            : ""
                        }`}
                      >
                        {property.listing_type || "Sale"}
                      </span>
                    </div>

                    <div className={styles.propertyContent}>
                      <p className={styles.propertyType}>
                        {property.property_type}
                      </p>

                      <h3>{property.title}</h3>

                      <p className={styles.propertyLocation}>
                        {property.location || "Pune"}
                        {property.city ? `, ${property.city}` : ""}
                      </p>

                      <div className={styles.propertyMeta}>
                        {property.bhk && (
                          <span>{property.bhk} BHK</span>
                        )}

                        {(property.carpet_area ||
                          property.built_up_area) && (
                          <span>
                            {property.carpet_area ||
                              property.built_up_area}
                          </span>
                        )}
                      </div>

                      <div className={styles.propertyBottom}>
                        <strong>
                          {property.price || "Price on Request"}
                        </strong>

                        <span>View Details →</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className={styles.categoriesSection}>
        <div className={styles.container}>
          <div className={styles.centerHeader}>
            <p className={styles.sectionLabel}>EXPLORE BY TYPE</p>

            <h2>
              Find Your <span>Perfect Property</span>
            </h2>

            <p>
              Explore different property options available across Pune.
            </p>
          </div>

          <div className={styles.categoryGrid}>
            {categories.map((category, index) => (
              <Link
                href={`/properties?type=${category.type}`}
                className={styles.categoryCard}
                key={category.title}
              >
                <span className={styles.categoryNumber}>
                  0{index + 1}
                </span>

                <div>
                  <h3>{category.title}</h3>
                  <p>{category.text}</p>
                </div>

                <span className={styles.categoryArrow}>↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className={styles.whySection}>
        <div className={styles.container}>
          <div className={styles.whyGrid}>
            <div className={styles.whyImage}>
              <div className={styles.whyImageOverlay}>
                <span>01</span>
                <p>
                  Helping you make
                  <br />
                  better property decisions.
                </p>
              </div>
            </div>

            <div className={styles.whyContent}>
              <p className={styles.sectionLabel}>WHY ULTIMATE REALTY UR</p>

              <h2>
                More Than Just
                <br />
                <span>Finding a Property.</span>
              </h2>

              <p className={styles.whyIntro}>
                Buying or renting a property is an important decision. We
                believe you deserve clear information, reliable guidance and a
                smooth experience at every stage.
              </p>

              <div className={styles.features}>
                <div className={styles.feature}>
                  <span>01</span>
                  <div>
                    <h3>Local Expertise</h3>
                    <p>
                      Strong understanding of Pune's real-estate market and
                      growing locations.
                    </p>
                  </div>
                </div>

                <div className={styles.feature}>
                  <span>02</span>
                  <div>
                    <h3>Curated Properties</h3>
                    <p>
                      Explore property options selected around your
                      requirements and preferences.
                    </p>
                  </div>
                </div>

                <div className={styles.feature}>
                  <span>03</span>
                  <div>
                    <h3>Personal Guidance</h3>
                    <p>
                      Get support from property discovery through the next
                      steps of your journey.
                    </p>
                  </div>
                </div>
              </div>

              <Link href="/contact" className={styles.primaryButtonDark}>
                Speak With Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className={styles.servicesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionLabel}>WHAT WE DO</p>

              <h2>
                Our <span>Services</span>
              </h2>
            </div>

            <Link href="/services" className={styles.viewAll}>
              Explore Services →
            </Link>
          </div>

          <div className={styles.servicesGrid}>
            {services.map((service) => (
              <div className={styles.serviceCard} key={service.number}>
                <span>{service.number}</span>

                <h3>{service.title}</h3>

                <p>{service.text}</p>

                <Link href="/contact">Learn More →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BUYER CTA */}
      <section className={styles.buyerSection}>
        <div className={styles.container}>
          <div className={styles.buyerContent}>
            <p className={styles.sectionLabel}>FOR HOME BUYERS</p>

            <h2>
              Your Dream Home
              <br />
              <span>Starts With One Conversation.</span>
            </h2>

            <p>
              Tell us what you are looking for and our team will help you
              explore suitable property options in Pune.
            </p>

            <div className={styles.heroActions}>
              <Link href="/contact" className={styles.primaryButton}>
                Send an Enquiry
              </Link>

              <a
                href="https://wa.me/919067513120"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.secondaryButton}
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div>
              <Link href="/" className={styles.footerLogo}>
                <span>ULTIMATE</span>
                <small>REALTY UR</small>
              </Link>

              <p className={styles.footerAbout}>
                Helping home buyers discover the right properties across
                Pune with trusted real-estate guidance.
              </p>
            </div>

            <div>
              <h4>Quick Links</h4>

              <Link href="/">Home</Link>
              <Link href="/properties">Properties</Link>
              <Link href="/about">About Us</Link>
              <Link href="/services">Services</Link>
              <Link href="/contact">Contact Us</Link>
            </div>

            <div>
              <h4>Property</h4>

              <Link href="/properties">Apartments</Link>
              <Link href="/properties">Flats</Link>
              <Link href="/properties">Villas</Link>
              <Link href="/properties">Plots</Link>
              <Link href="/properties">Commercial</Link>
            </div>

            <div>
              <h4>Contact</h4>

              <a href="tel:+919067513120">+91 90675 13120</a>

              <a href="mailto:ultimaterealty711@gmail.com">
                ultimaterealty711@gmail.com
              </a>

              <p>
                Ravet, Mukai Chowk,
                <br />
                Pune, Maharashtra
              </p>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <span>
              © {new Date().getFullYear()} Ultimate Realty UR. All rights
              reserved.
            </span>

            <span>Real Estate • Pune</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import styles from "./page.module.css";

type Property = {
  id: string;
  title: string;
  property_type: string | null;
  listing_type: string | null;
  price: string | null;
  location: string | null;
  city: string | null;
  bhk: string | null;
  carpet_area: string | null;
  built_up_area: string | null;
  description: string | null;
  amenities: string[] | null;
  images: string[] | null;
};

const propertyTypes = [
  "All",
  "Flat",
  "Apartment",
  "Villa",
  "Plot",
  "Commercial",
  "Office",
  "Shop",
  "Other",
];

const listingTypes = ["All", "Sale", "Rent"];
const bhkOptions = ["All", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK"];

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [propertyType, setPropertyType] = useState("All");
  const [listingType, setListingType] = useState("All");
  const [bhk, setBhk] = useState("All");

  useEffect(() => {
    async function loadProperties() {
      setLoading(true);

      const { data, error } = await supabase
        .from("properties")
        .select(
          `
          id,
          title,
          property_type,
          listing_type,
          price,
          location,
          city,
          bhk,
          carpet_area,
          built_up_area,
          description,
          amenities,
          images
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading properties:", error);
        setProperties([]);
      } else {
        setProperties(data || []);
      }

      setLoading(false);
    }

    loadProperties();
  }, []);

  const filteredProperties = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return properties.filter((property) => {
      const matchesSearch =
        !searchValue ||
        [
          property.title,
          property.location,
          property.city,
          property.property_type,
          property.bhk,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(searchValue);

      const matchesType =
        propertyType === "All" ||
        property.property_type?.toLowerCase() === propertyType.toLowerCase();

      const matchesListing =
        listingType === "All" ||
        property.listing_type?.toLowerCase() === listingType.toLowerCase();

      const matchesBhk =
        bhk === "All" ||
        property.bhk?.toLowerCase().includes(bhk.toLowerCase());

      return matchesSearch && matchesType && matchesListing && matchesBhk;
    });
  }, [properties, search, propertyType, listingType, bhk]);

  const clearFilters = () => {
    setSearch("");
    setPropertyType("All");
    setListingType("All");
    setBhk("All");
  };

  return (
    <main className={styles.page}>
      {/* TOP BAR */}
      <div className={styles.topBar}>
        <div className={styles.container}>
          <div className={styles.topBarLeft}>
            <a href="tel:+919067513120">+91 90675 13120</a>
            <span className={styles.topDivider}>|</span>
            <a href="mailto:ultimaterealty711@gmail.com">
              ultimaterealty711@gmail.com
            </a>
          </div>

          <div className={styles.topBarRight}>
            <span>Trusted Real Estate Solutions in Pune</span>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            <img
             src="/images/ultimate-realty-logo.png"
              alt="Ultimate Realty UR"
              className={styles.logoImage}
            />
            <span>
              <span className={styles.logoMain}>ULTIMATE REALTY</span>
               <span className={styles.logoSub}>UR • PUNE</span>
            </span>
          </Link>
          <nav className={styles.nav}>
            <Link href="/">Home</Link>
            <Link href="/properties" className={styles.activeNav}>
              Properties
            </Link>
            <Link href="/about">About Us</Link>
            <Link href="/services">Services</Link>
            <Link href="/contact">Contact Us</Link>
          </nav>

          <a href="tel:+919067513120" className={styles.headerButton}>
            Schedule a Call
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />

        <div className={styles.container}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>OUR PROPERTY COLLECTION</span>

            <h1>
              Find a Place
              <br />
              <em>You'll Love to Call Home.</em>
            </h1>

            <p>
              Explore carefully selected residential and commercial properties
              across Pune, with guidance you can trust at every step.
            </p>

            <div className={styles.heroActions}>
              <a href="#property-list" className={styles.primaryButton}>
                Explore Properties
              </a>

              <Link href="/contact" className={styles.secondaryButton}>
                Talk to an Expert
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH SECTION */}
      <section className={styles.searchSection}>
        <div className={styles.container}>
          <div className={styles.searchBox}>
            <div className={styles.searchHeading}>
              <span>PROPERTY SEARCH</span>
              <h2>Find Your Ideal Property</h2>
            </div>

            <div className={styles.searchGrid}>
              <div className={styles.searchField}>
                <label>Search</label>
                <input
                  type="text"
                  placeholder="Location, property name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className={styles.searchField}>
                <label>Property Type</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.searchField}>
                <label>Listing</label>
                <select
                  value={listingType}
                  onChange={(e) => setListingType(e.target.value)}
                >
                  {listingTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.searchField}>
                <label>BHK</label>
                <select
                  value={bhk}
                  onChange={(e) => setBhk(e.target.value)}
                >
                  {bhkOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className={styles.searchButton}
                onClick={() => {
                  document
                    .getElementById("property-list")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Search Properties
              </button>
            </div>

            {(search ||
              propertyType !== "All" ||
              listingType !== "All" ||
              bhk !== "All") && (
              <button
                type="button"
                className={styles.clearButton}
                onClick={clearFilters}
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* PROPERTY LIST */}
      <section className={styles.propertiesSection} id="property-list">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.eyebrowDark}>AVAILABLE PROPERTIES</span>
              <h2>Explore Our Listings</h2>
            </div>

            <p>
              {loading
                ? "Loading properties..."
                : `${filteredProperties.length} ${
                    filteredProperties.length === 1
                      ? "property"
                      : "properties"
                  } found`}
            </p>
          </div>

          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.loader} />
              <p>Loading our property collection...</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>⌂</span>
              <h3>No properties found</h3>
              <p>
                We couldn't find a property matching your current search.
                Try changing your filters.
              </p>

              <button
                type="button"
                className={styles.darkButton}
                onClick={clearFilters}
              >
                View All Properties
              </button>
            </div>
          ) : (
            <div className={styles.propertyGrid}>
              {filteredProperties.map((property) => {
                const image =
                  property.images && property.images.length > 0
                    ? property.images[0]
                    : "/property-placeholder.jpg";

                return (
                  <article className={styles.propertyCard} key={property.id}>
                    <Link
                      href={`/properties/${property.id}`}
                      className={styles.imageWrap}
                    >
                      <img
                        src={image}
                        alt={property.title || "Property"}
                        className={styles.propertyImage}
                      />

                      <span className={styles.listingBadge}>
                        {property.listing_type || "Property"}
                      </span>

                      <span className={styles.viewBadge}>View Property →</span>
                    </Link>

                    <div className={styles.cardBody}>
                      <div className={styles.cardTop}>
                        <span className={styles.propertyType}>
                          {property.property_type || "Property"}
                        </span>

                        {property.price && (
                          <span className={styles.price}>
                            {property.price}
                          </span>
                        )}
                      </div>

                      <h3>{property.title || "Premium Property"}</h3>

                      <div className={styles.location}>
                        <span>⌖</span>
                        <span>
                          {[property.location, property.city]
                            .filter(Boolean)
                            .join(", ") || "Pune"}
                        </span>
                      </div>

                      <div className={styles.details}>
                        {property.bhk && (
                          <div>
                            <strong>{property.bhk}</strong>
                            <span>BHK</span>
                          </div>
                        )}

                        {(property.carpet_area ||
                          property.built_up_area) && (
                          <div>
                            <strong>
                              {property.carpet_area ||
                                property.built_up_area}
                            </strong>
                            <span>Area</span>
                          </div>
                        )}

                        {property.amenities &&
                          property.amenities.length > 0 && (
                            <div>
                              <strong>{property.amenities.length}+</strong>
                              <span>Amenities</span>
                            </div>
                          )}
                      </div>

                      <div className={styles.cardFooter}>
                        <Link href={`/properties/${property.id}`}>
                          View Details
                        </Link>

                        <a
                          href={`https://wa.me/919067513120?text=${encodeURIComponent(
                            `Hello Ultimate Realty UR, I am interested in ${property.title}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.whatsapp}
                        >
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className={styles.trustSection}>
        <div className={styles.container}>
          <div className={styles.trustGrid}>
            <div className={styles.trustImage}>
              <img
                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85"
                alt="Modern luxury interior"
              />
            </div>

            <div className={styles.trustContent}>
              <span className={styles.eyebrowDark}>WHY ULTIMATE REALTY</span>

              <h2>
                More Than
                <br />
                <em>Just Property.</em>
              </h2>

              <p>
                Finding the right property is a major decision. We make the
                process simpler with local market knowledge, carefully selected
                properties and personal guidance.
              </p>

              <div className={styles.trustPoints}>
                <div>
                  <span>01</span>
                  <div>
                    <h3>Local Expertise</h3>
                    <p>
                      Strong understanding of Pune's property market and
                      neighbourhoods.
                    </p>
                  </div>
                </div>

                <div>
                  <span>02</span>
                  <div>
                    <h3>Curated Properties</h3>
                    <p>
                      Discover residential and commercial opportunities suited
                      to your requirements.
                    </p>
                  </div>
                </div>

                <div>
                  <span>03</span>
                  <div>
                    <h3>Personal Guidance</h3>
                    <p>
                      From your first enquiry to your final decision, we're
                      here to help.
                    </p>
                  </div>
                </div>
              </div>

              <Link href="/about" className={styles.outlineButton}>
                Learn About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaOverlay} />

        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <span className={styles.eyebrow}>LET'S FIND YOUR NEXT PROPERTY</span>

            <h2>
              Your Next Chapter
              <br />
              <em>Starts Here.</em>
            </h2>

            <p>
              Tell us what you're looking for and let our team help you find
              the right property in Pune.
            </p>

            <div className={styles.ctaActions}>
              <Link href="/contact" className={styles.primaryButton}>
                Send an Enquiry
              </Link>

              <a href="tel:+919067513120" className={styles.secondaryButton}>
                Call +91 90675 13120
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div className={styles.footerBrand}>
              <Link href="/" className={styles.logo}>
                <img
                  src="/images/ultimate-realty-logo.png"
                  alt="Ultimate Realty UR"
                  className={styles.logoImage}
                />
                <span>
                  <span className={styles.logoMain}>ULTIMATE REALTY</span>
                  <span className={styles.logoSub}>UR • PUNE</span>
                </span>
              </Link>

              <p>
                Helping you find the right property with clarity, confidence
                and trusted local expertise.
              </p>
            </div>

            <div className={styles.footerColumn}>
              <h4>Quick Links</h4>
              <Link href="/">Home</Link>
              <Link href="/properties">Properties</Link>
              <Link href="/about">About Us</Link>
              <Link href="/services">Services</Link>
              <Link href="/contact">Contact Us</Link>
            </div>

            <div className={styles.footerColumn}>
              <h4>Explore</h4>
              <Link href="/properties">Buy Property</Link>
              <Link href="/properties">Rent Property</Link>
              <Link href="/properties">Residential</Link>
              <Link href="/properties">Commercial</Link>
              <Link href="/maharera">MahaRERA</Link>
            </div>

            <div className={styles.footerColumn}>
              <h4>Contact</h4>
              <a href="tel:+919067513120">+91 90675 13120</a>
              <a href="mailto:ultimaterealty711@gmail.com">
                ultimaterealty711@gmail.com
              </a>
              <span>Ravet, Mukai Chowk</span>
              <span>Pune, Maharashtra</span>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <span>© 2026 Ultimate Realty UR. All rights reserved.</span>
            <span>Real Estate • Pune</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
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
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [propertyType, setPropertyType] = useState("All");
  const [listingType, setListingType] = useState("All");
  const [bhk, setBhk] = useState("All");

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    setLoading(true);
    setError("");

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
      console.error(error);
      setError("Unable to load properties. Please try again.");
      setProperties([]);
    } else {
      setProperties((data as Property[]) || []);
    }

    setLoading(false);
  }

  const filteredProperties = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return properties.filter((property) => {
      const searchableText = [
        property.title,
        property.property_type,
        property.listing_type,
        property.location,
        property.city,
        property.bhk,
        property.price,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !searchText || searchableText.includes(searchText);

      const matchesType =
        propertyType === "All" ||
        property.property_type?.toLowerCase() === propertyType.toLowerCase();

      const matchesListing =
        listingType === "All" ||
        property.listing_type?.toLowerCase() === listingType.toLowerCase();

      const matchesBhk =
        bhk === "All" ||
        property.bhk?.toLowerCase() === bhk.toLowerCase();

      return (
        matchesSearch &&
        matchesType &&
        matchesListing &&
        matchesBhk
      );
    });
  }, [properties, search, propertyType, listingType, bhk]);

  function clearFilters() {
    setSearch("");
    setPropertyType("All");
    setListingType("All");
    setBhk("All");
  }

  function getImage(property: Property) {
    if (property.images && property.images.length > 0) {
      return property.images[0];
    }

    return "/property-placeholder.jpg";
  }

  return (
    <main className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoMain}>ULTIMATE REALTY</span>
            <span className={styles.logoSub}>UR</span>
          </Link>

          <nav className={styles.navigation}>
            <Link href="/">Home</Link>
            <Link href="/properties" className={styles.active}>
              Properties
            </Link>
            <Link href="/about">About Us</Link>
            <Link href="/services">Services</Link>
            <Link href="/contact">Contact</Link>
          </nav>

          <a
            href="tel:+919067513120"
            className={styles.headerButton}
          >
            Call Us
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}>
          <p className={styles.eyebrow}>ULTIMATE REALTY UR</p>

          <h1>Find Your Perfect Property</h1>

          <p>
            Explore premium homes, apartments, villas, plots and
            commercial properties across Pune.
          </p>
        </div>
      </section>

      {/* FILTER SECTION */}
      <section className={styles.filterSection}>
        <div className={styles.filterContainer}>
          <div className={styles.filterHeading}>
            <div>
              <span>PROPERTY SEARCH</span>
              <h2>Find a Property</h2>
            </div>

            <p>
              {filteredProperties.length}{" "}
              {filteredProperties.length === 1
                ? "Property"
                : "Properties"}{" "}
              Available
            </p>
          </div>

          <div className={styles.filters}>
            <div className={styles.searchBox}>
              <label>Search</label>

              <input
                type="text"
                placeholder="Search location, property..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className={styles.filterBox}>
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

            <div className={styles.filterBox}>
              <label>Purpose</label>

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

            <div className={styles.filterBox}>
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
              className={styles.clearButton}
              onClick={clearFilters}
            >
              Clear
            </button>
          </div>
        </div>
      </section>

      {/* PROPERTIES */}
      <section className={styles.propertiesSection}>
        <div className={styles.propertiesContainer}>
          {loading ? (
            <div className={styles.statusBox}>
              <div className={styles.loader}></div>
              <p>Loading properties...</p>
            </div>
          ) : error ? (
            <div className={styles.statusBox}>
              <h3>Something went wrong</h3>
              <p>{error}</p>

              <button
                type="button"
                className={styles.retryButton}
                onClick={loadProperties}
              >
                Try Again
              </button>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>⌂</div>

              <h3>No Properties Found</h3>

              <p>
                We could not find any property matching your
                current search or filters.
              </p>

              <button
                type="button"
                className={styles.retryButton}
                onClick={clearFilters}
              >
                View All Properties
              </button>
            </div>
          ) : (
            <div className={styles.propertyGrid}>
              {filteredProperties.map((property) => (
                <article
                  className={styles.propertyCard}
                  key={property.id}
                >
                  <Link
                    href={`/properties/${property.id}`}
                    className={styles.imageWrapper}
                  >
                    <img
                      src={getImage(property)}
                      alt={property.title}
                      className={styles.propertyImage}
                    />

                    <div className={styles.imageShade}></div>

                    <span className={styles.listingBadge}>
                      {property.listing_type || "Property"}
                    </span>

                    <span className={styles.viewDetails}>
                      View Details →
                    </span>
                  </Link>

                  <div className={styles.cardContent}>
                    <p className={styles.propertyType}>
                      {property.property_type || "Property"}
                    </p>

                    <Link
                      href={`/properties/${property.id}`}
                      className={styles.propertyTitle}
                    >
                      {property.title}
                    </Link>

                    <p className={styles.location}>
                      <span>⌖</span>
                      {property.location || "Pune"}
                      {property.city
                        ? `, ${property.city}`
                        : ""}
                    </p>

                    <div className={styles.details}>
                      {property.bhk && (
                        <div>
                          <strong>{property.bhk}</strong>
                          <span>BHK</span>
                        </div>
                      )}

                      {property.carpet_area && (
                        <div>
                          <strong>{property.carpet_area}</strong>
                          <span>Carpet Area</span>
                        </div>
                      )}

                      {property.built_up_area && (
                        <div>
                          <strong>
                            {property.built_up_area}
                          </strong>
                          <span>Built-up</span>
                        </div>
                      )}
                    </div>

                    <div className={styles.cardFooter}>
                      <div>
                        <span className={styles.priceLabel}>
                          Price
                        </span>

                        <strong className={styles.price}>
                          {property.price || "Price on Request"}
                        </strong>
                      </div>

                      <a
                        href={`https://wa.me/919067513120?text=${encodeURIComponent(
                          `Hello Ultimate Realty UR, I am interested in "${property.title}". Please share more details.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.whatsappButton}
                        onClick={(e) => e.stopPropagation()}
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <div>
            <span>CAN'T FIND WHAT YOU'RE LOOKING FOR?</span>

            <h2>
              Let us help you find your
              <br />
              dream property.
            </h2>
          </div>

          <Link href="/contact" className={styles.ctaButton}>
            Contact Us →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div>
            <div className={styles.footerLogo}>
              ULTIMATE REALTY <span>UR</span>
            </div>

            <p>
              Helping you find your perfect property
              <br />
              across Pune.
            </p>
          </div>

          <div className={styles.footerLinks}>
            <Link href="/">Home</Link>
            <Link href="/properties">Properties</Link>
            <Link href="/about">About Us</Link>
            <Link href="/contact">Contact</Link>
          </div>

          <div className={styles.footerContact}>
            <a href="tel:+919067513120">+91 90675 13120</a>
            <a href="mailto:ultimaterealty711@gmail.com">
              ultimaterealty711@gmail.com
            </a>
            <p>Ravet, Mukai Chowk, Pune</p>
          </div>
        </div>

        <div className={styles.footerBottom}>
          © {new Date().getFullYear()} Ultimate Realty UR. All
          Rights Reserved.
        </div>
      </footer>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
  bedrooms: string | null;
  bathrooms: string | null;
  balconies: string | null;
  carpet_area: string | null;
  built_up_area: string | null;
  plot_area: string | null;
  floor: string | null;
  total_floors: string | null;
  furnishing_status: string | null;
  pincode: string | null;
  complete_address: string | null;
  google_maps_url: string | null;
  description: string | null;
  amenities: string[] | null;
  images: string[] | null;
  videos: string[] | null;
};

export default function PropertyDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!id) return;

    const loadProperty = async () => {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("properties")
        .select(`
          id,
          title,
          property_type,
          listing_type,
          price,
          location,
          city,
          bhk,
          bedrooms,
          bathrooms,
          balconies,
          carpet_area,
          built_up_area,
          plot_area,
          floor,
          total_floors,
          furnishing_status,
          pincode,
          complete_address,
          google_maps_url,
          description,
          amenities,
          images,
          videos
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        setError("Property not found.");
        setLoading(false);
        return;
      }

      setProperty(data);
      setLoading(false);
    };

    loadProperty();
  }, [id]);

  if (loading) {
    return (
      <main className={styles.loadingPage}>
        <div className={styles.loader}></div>
        <p>Loading property details...</p>
      </main>
    );
  }

  if (error || !property) {
    return (
      <main className={styles.errorPage}>
        <span className={styles.errorLabel}>PROPERTY NOT FOUND</span>
        <h1>We couldn't find this property.</h1>
        <p>
          The property may have been removed or the link may be incorrect.
        </p>

        <Link href="/properties" className={styles.backButton}>
          ← Back to Properties
        </Link>
      </main>
    );
  }

  const images =
    property.images && property.images.length > 0
      ? property.images
      : ["/property-placeholder.jpg"];

  const amenities = property.amenities || [];

  const phoneNumber = "919067513120";
  const displayPhone = "+91 90675 13120";

  const whatsappMessage = encodeURIComponent(
    `Hello Ultimate Realty UR, I am interested in "${property.title}". Please share more details.`
  );

  const handlePrevious = () => {
    setActiveImage((current) =>
      current === 0 ? images.length - 1 : current - 1
    );
  };

  const handleNext = () => {
    setActiveImage((current) =>
      current === images.length - 1 ? 0 : current + 1
    );
  };

  return (
    <main className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoMain}>ULTIMATE REALTY</span>
            <span className={styles.logoSub}>UR</span>
          </Link>

          <nav className={styles.nav}>
            <Link href="/">Home</Link>
            <Link href="/properties" className={styles.activeNav}>
              Properties
            </Link>
            <Link href="/about">About Us</Link>
            <Link href="/services">Services</Link>
            <Link href="/contact">Contact</Link>
          </nav>

          <a href={`tel:${phoneNumber}`} className={styles.headerCall}>
            <span>Call Us</span>
            {displayPhone}
          </a>
        </div>
      </header>

      {/* BREADCRUMB */}
      <section className={styles.breadcrumbSection}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}>
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/properties">Properties</Link>
            <span>/</span>
            <strong>{property.title}</strong>
          </div>
        </div>
      </section>

      {/* PROPERTY GALLERY */}
      <section className={styles.gallerySection}>
        <div className={styles.container}>
          <div className={styles.gallery}>
            <div className={styles.mainImageWrapper}>
              <img
                src={images[activeImage]}
                alt={property.title}
                className={styles.mainImage}
              />

              <div className={styles.imageOverlay}>
                <span className={styles.propertyType}>
                  {property.property_type || "Property"}
                </span>

                {property.listing_type && (
                  <span className={styles.listingType}>
                    For {property.listing_type}
                  </span>
                )}
              </div>

              {images.length > 1 && (
                <>
                  <button
                    className={`${styles.imageArrow} ${styles.leftArrow}`}
                    onClick={handlePrevious}
                    aria-label="Previous image"
                  >
                    ‹
                  </button>

                  <button
                    className={`${styles.imageArrow} ${styles.rightArrow}`}
                    onClick={handleNext}
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </>
              )}

              <div className={styles.imageCounter}>
                {activeImage + 1} / {images.length}
              </div>
            </div>

            {images.length > 1 && (
              <div className={styles.thumbnailGrid}>
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`${styles.thumbnail} ${
                      activeImage === index ? styles.activeThumbnail : ""
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${property.title} ${index + 1}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.contentGrid}>
            {/* LEFT */}
            <div className={styles.mainContent}>
              <div className={styles.titleBlock}>
                <span className={styles.eyebrow}>
                  {property.listing_type
                    ? `FOR ${property.listing_type.toUpperCase()}`
                    : "PREMIUM PROPERTY"}
                </span>

                <h1>{property.title}</h1>

                <div className={styles.location}>
                  <span>⌖</span>
                  {property.location || property.city || "Pune"}
                  {property.city && property.location
                    ? `, ${property.city}`
                    : ""}
                </div>
              </div>

              {/* PRICE */}
              <div className={styles.priceBox}>
                <div>
                  <span className={styles.priceLabel}>PROPERTY PRICE</span>
                  <strong>{property.price || "Price on Request"}</strong>
                </div>

                {property.bhk && (
                  <div className={styles.priceBhk}>
                    <span>{property.bhk}</span>
                    <small>BHK</small>
                  </div>
                )}
              </div>

              {/* QUICK DETAILS */}
              <div className={styles.detailsSection}>
                <div className={styles.sectionHeading}>
                  <span>01</span>
                  <h2>Property Overview</h2>
                </div>

                <div className={styles.detailsGrid}>
                  {property.bhk && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailIcon}>⌂</span>
                      <div>
                        <small>BHK</small>
                        <strong>{property.bhk}</strong>
                      </div>
                    </div>
                  )}

                  {property.bedrooms && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailIcon}>🛏</span>
                      <div>
                        <small>Bedrooms</small>
                        <strong>{property.bedrooms}</strong>
                      </div>
                    </div>
                  )}

                  {property.bathrooms && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailIcon}>♨</span>
                      <div>
                        <small>Bathrooms</small>
                        <strong>{property.bathrooms}</strong>
                      </div>
                    </div>
                  )}

                  {property.balconies && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailIcon}>▱</span>
                      <div>
                        <small>Balconies</small>
                        <strong>{property.balconies}</strong>
                      </div>
                    </div>
                  )}

                  {property.carpet_area && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailIcon}>□</span>
                      <div>
                        <small>Carpet Area</small>
                        <strong>{property.carpet_area}</strong>
                      </div>
                    </div>
                  )}

                  {property.built_up_area && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailIcon}>▣</span>
                      <div>
                        <small>Built-up Area</small>
                        <strong>{property.built_up_area}</strong>
                      </div>
                    </div>
                  )}

                  {property.plot_area && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailIcon}>◇</span>
                      <div>
                        <small>Plot Area</small>
                        <strong>{property.plot_area}</strong>
                      </div>
                    </div>
                  )}

                  {property.floor && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailIcon}>▥</span>
                      <div>
                        <small>Floor</small>
                        <strong>
                          {property.floor}
                          {property.total_floors
                            ? ` / ${property.total_floors}`
                            : ""}
                        </strong>
                      </div>
                    </div>
                  )}

                  {property.furnishing_status && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailIcon}>✦</span>
                      <div>
                        <small>Furnishing</small>
                        <strong>{property.furnishing_status}</strong>
                      </div>
                    </div>
                  )}

                  {property.property_type && (
                    <div className={styles.detailItem}>
                      <span className={styles.detailIcon}>⌂</span>
                      <div>
                        <small>Property Type</small>
                        <strong>{property.property_type}</strong>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* DESCRIPTION */}
              {property.description && (
                <div className={styles.detailsSection}>
                  <div className={styles.sectionHeading}>
                    <span>02</span>
                    <h2>About This Property</h2>
                  </div>

                  <div className={styles.description}>
                    {property.description
                      .split("\n")
                      .map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                  </div>
                </div>
              )}

              {/* AMENITIES */}
              {amenities.length > 0 && (
                <div className={styles.detailsSection}>
                  <div className={styles.sectionHeading}>
                    <span>03</span>
                    <h2>Amenities & Features</h2>
                  </div>

                  <div className={styles.amenitiesGrid}>
                    {amenities.map((amenity, index) => (
                      <div className={styles.amenity} key={index}>
                        <span>✓</span>
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LOCATION */}
              <div className={styles.detailsSection}>
                <div className={styles.sectionHeading}>
                  <span>04</span>
                  <h2>Location</h2>
                </div>

                <div className={styles.addressBox}>
                  <span className={styles.addressIcon}>⌖</span>

                  <div>
                    <strong>
                      {property.location || property.city || "Pune"}
                    </strong>

                    {property.complete_address && (
                      <p>{property.complete_address}</p>
                    )}

                    {!property.complete_address && property.city && (
                      <p>
                        {property.location
                          ? `${property.location}, ${property.city}`
                          : property.city}
                        {property.pincode
                          ? ` - ${property.pincode}`
                          : ""}
                      </p>
                    )}
                  </div>
                </div>

                {property.google_maps_url && (
                  <a
                    href={property.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.mapButton}
                  >
                    View on Google Maps →
                  </a>
                )}
              </div>

              {/* VIDEO */}
              {property.videos && property.videos.length > 0 && (
                <div className={styles.detailsSection}>
                  <div className={styles.sectionHeading}>
                    <span>05</span>
                    <h2>Property Video</h2>
                  </div>

                  <div className={styles.videoBox}>
                    <a
                      href={property.videos[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.videoButton}
                    >
                      ▶ Watch Property Video
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT SIDEBAR */}
            <aside className={styles.sidebar}>
              <div className={styles.enquiryCard}>
                <span className={styles.cardLabel}>INTERESTED IN THIS PROPERTY?</span>

                <h2>Let's help you find your dream home.</h2>

                <p>
                  Speak with our property expert for pricing, availability,
                  site visits and more information.
                </p>

                <div className={styles.actionButtons}>
                  <a
                    href={`tel:${phoneNumber}`}
                    className={styles.callButton}
                  >
                    <span>☎</span>
                    Call Now
                  </a>

                  <a
                    href={`https://wa.me/${phoneNumber}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.whatsappButton}
                  >
                    <span>◉</span>
                    WhatsApp
                  </a>
                </div>

                <div className={styles.contactDivider}>
                  <span>OR</span>
                </div>

                <Link href="/contact" className={styles.enquiryButton}>
                  Send an Enquiry →
                </Link>

                <div className={styles.agentInfo}>
                  <div className={styles.agentAvatar}>UR</div>

                  <div>
                    <strong>Ultimate Realty UR</strong>
                    <span>Property Consultant</span>
                  </div>
                </div>
              </div>

              <div className={styles.trustCard}>
                <span>WHY ULTIMATE REALTY UR?</span>

                <div>
                  <strong>✓</strong>
                  <p>Verified property information</p>
                </div>

                <div>
                  <strong>✓</strong>
                  <p>Professional property assistance</p>
                </div>

                <div>
                  <strong>✓</strong>
                  <p>Site visit assistance</p>
                </div>

                <div>
                  <strong>✓</strong>
                  <p>Complete buying & rental support</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className={styles.bottomCta}>
        <div className={styles.container}>
          <div>
            <span>READY TO TAKE THE NEXT STEP?</span>
            <h2>Find the place you'll love to call home.</h2>
          </div>

          <div className={styles.ctaActions}>
            <a href={`tel:${phoneNumber}`}>Call {displayPhone}</a>

            <a
              href={`https://wa.me/${phoneNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div>
              <div className={styles.footerLogo}>ULTIMATE REALTY UR</div>
              <p>
                Helping you find the right property in Pune with confidence.
              </p>
            </div>

            <div>
              <span className={styles.footerTitle}>QUICK LINKS</span>

              <Link href="/">Home</Link>
              <Link href="/properties">Properties</Link>
              <Link href="/about">About Us</Link>
              <Link href="/services">Services</Link>
              <Link href="/contact">Contact</Link>
            </div>

            <div>
              <span className={styles.footerTitle}>CONTACT</span>

              <a href={`tel:${phoneNumber}`}>{displayPhone}</a>
              <a href="mailto:ultimaterealty711@gmail.com">
                ultimaterealty711@gmail.com
              </a>
              <span>Ravet, Mukai Chowk, Pune</span>
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
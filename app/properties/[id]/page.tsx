"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

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
  floor: string | null;
  total_floors: string | null;
  furnishing_status: string | null;
  carpet_area: string | null;
  built_up_area: string | null;
  plot_area: string | null;
  description: string | null;
  amenities: string[] | null;
  images: string[] | null;
  videos: string[] | null;
  latitude: number | null;
  longitude: number | null;
  pincode: string | null;
  complete_address: string | null;
  google_maps_url: string | null;
};

const PHONE = "9067513120";
const WHATSAPP_NUMBER = "919067513120";

export default function PropertyDetailsPage() {
  const params = useParams();

  const propertyId = Array.isArray(params?.id)
    ? params.id[0]
    : params?.id;

  const [property, setProperty] = useState<Property | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [activeImage, setActiveImage] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState("");
  const [enquiryError, setEnquiryError] = useState("");

  /* --------------------------------
     LOAD PROPERTY
  -------------------------------- */

  useEffect(() => {
    if (!propertyId) {
      setLoading(false);
      setPageError("Property ID is missing.");
      return;
    }

    const loadProperty = async () => {
      setLoading(true);
      setPageError("");

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
          floor,
          total_floors,
          furnishing_status,
          carpet_area,
          built_up_area,
          plot_area,
          description,
          amenities,
          images,
          videos,
          latitude,
          longitude,
          pincode,
          complete_address,
          google_maps_url
        `)
        .eq("id", propertyId)
        .single();

      if (error) {
        console.error(
          "Property loading error:",
          error
        );

        setProperty(null);
        setPageError(
          "We could not load this property. It may have been removed or the link may be incorrect."
        );
      } else {
        setProperty(data as Property);
      }

      setLoading(false);
    };

    loadProperty();
  }, [propertyId]);

  /* --------------------------------
     NORMALIZE MEDIA
  -------------------------------- */

  const images = useMemo(() => {
    if (!property?.images) {
      return [];
    }

    return property.images.filter(
      (image): image is string =>
        typeof image === "string" &&
        image.trim().length > 0
    );
  }, [property]);

  const videos = useMemo(() => {
    if (!property?.videos) {
      return [];
    }

    return property.videos.filter(
      (video): video is string =>
        typeof video === "string" &&
        video.trim().length > 0
    );
  }, [property]);

  /* --------------------------------
     CURRENT IMAGE SAFETY
  -------------------------------- */

  useEffect(() => {
    if (
      activeImage >= images.length &&
      images.length > 0
    ) {
      setActiveImage(0);
    }
  }, [activeImage, images.length]);

  /* --------------------------------
     FORM CHANGE
  -------------------------------- */

  const handleFormChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* --------------------------------
     ENQUIRY SUBMIT
  -------------------------------- */

  const handleEnquirySubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!property) {
      return;
    }

    if (submitting) {
      return;
    }

    setSubmitting(true);
    setEnquirySuccess("");
    setEnquiryError("");

    try {
      const requirement =
        formData.message.trim() ||
        `I am interested in ${property.title}.`;

      const { error } = await supabase
        .from("enquiries")
        .insert([
          {
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim() || null,
            requirement,
            property_type:
              property.property_type || null,
            preferred_location:
              property.location || property.city || null,
            budget: property.price || null,
          },
        ]);

      if (error) {
        throw error;
      }

      setEnquirySuccess(
        "Thank you! Your enquiry has been submitted successfully. Our team will contact you soon."
      );

      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error(
        "Property enquiry error:",
        error
      );

      setEnquiryError(
        "Something went wrong while sending your enquiry. Please try again or contact us directly."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* --------------------------------
     WHATSAPP
  -------------------------------- */

  const whatsappUrl = property
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `Hello Ultimate Realty UR, I am interested in ${property.title}. Please share more details.`
      )}`
    : `https://wa.me/${WHATSAPP_NUMBER}`;

  /* --------------------------------
     VIDEO URL HELPER
  -------------------------------- */

  const getYouTubeEmbedUrl = (url: string) => {
    try {
      const parsed = new URL(url);

      if (
        parsed.hostname.includes("youtube.com") &&
        parsed.pathname === "/watch"
      ) {
        const videoId =
          parsed.searchParams.get("v");

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      if (parsed.hostname === "youtu.be") {
        const videoId =
          parsed.pathname.replace("/", "");

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      if (
        parsed.hostname.includes("youtube.com") &&
        parsed.pathname.startsWith("/shorts/")
      ) {
        const videoId =
          parsed.pathname.split("/")[2];

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      return null;
    } catch {
      return null;
    }
  };

  /* --------------------------------
     LOADING
  -------------------------------- */

  if (loading) {
    return (
      <main>
        <header className="simple-header">
          <div className="container simple-header-inner">
            <Link
              href="/"
              className="simple-logo"
            >
              <span>UR</span>

              <div>
                <strong>
                  ULTIMATE REALTY
                </strong>
                <small>
                  UR • PUNE
                </small>
              </div>
            </Link>

            <nav>
              <Link href="/">
                Home
              </Link>

              <Link href="/properties">
                Properties
              </Link>

              <Link href="/services">
                Services
              </Link>

              <Link href="/about">
                About
              </Link>

              <Link href="/contact">
                Contact
              </Link>
            </nav>
          </div>
        </header>

        <section className="property-details-section">
          <div className="container">
            <div
              style={{
                minHeight: "500px",
                display: "grid",
                placeItems: "center",
                textAlign: "center",
              }}
            >
              <div>
                <p className="section-label">
                  ULTIMATE REALTY UR
                </p>

                <h2
                  style={{
                    margin: "10px 0",
                    fontFamily:
                      '"Playfair Display", serif',
                  }}
                >
                  Loading Property...
                </h2>

                <p
                  style={{
                    color: "var(--muted)",
                  }}
                >
                  Please wait while we load the
                  property details.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  /* --------------------------------
     PROPERTY NOT FOUND
  -------------------------------- */

  if (!property) {
    return (
      <main>
        <header className="simple-header">
          <div className="container simple-header-inner">
            <Link
              href="/"
              className="simple-logo"
            >
              <span>UR</span>

              <div>
                <strong>
                  ULTIMATE REALTY
                </strong>

                <small>
                  UR • PUNE
                </small>
              </div>
            </Link>

            <nav>
              <Link href="/">
                Home
              </Link>

              <Link href="/properties">
                Properties
              </Link>

              <Link href="/services">
                Services
              </Link>

              <Link href="/about">
                About
              </Link>

              <Link href="/contact">
                Contact
              </Link>
            </nav>
          </div>
        </header>

        <section className="property-details-section">
          <div className="container">
            <div
              style={{
                minHeight: "500px",
                display: "grid",
                placeItems: "center",
                textAlign: "center",
              }}
            >
              <div>
                <p className="section-label">
                  PROPERTY NOT FOUND
                </p>

                <h1
                  style={{
                    fontFamily:
                      '"Playfair Display", serif',
                    margin: "10px 0 20px",
                  }}
                >
                  This property is unavailable
                </h1>

                <p
                  style={{
                    color: "var(--muted)",
                    maxWidth: "550px",
                    margin: "0 auto 25px",
                  }}
                >
                  {pageError ||
                    "The property may have been removed or the URL may be incorrect."}
                </p>

                <Link
                  href="/properties"
                  className="primary-button"
                >
                  ← View All Properties
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const displayLocation = [
    property.location,
    property.city,
  ]
    .filter(Boolean)
    .join(", ");

  const mainImage =
    images[activeImage] || "";

  return (
    <main>
      {/* HEADER */}

      <header className="simple-header">
        <div className="container simple-header-inner">
          <Link
            href="/"
            className="simple-logo"
          >
            <img
              src="/images/ultimate-realty-logo.png"
              alt="Ultimate Realty UR"
              className="simple-logo-image"
            />

            <div className="simple-logo-text">
              <strong>
                ULTIMATE REALTY
              </strong>

              <small>
                UR • PUNE
              </small>
            </div>
          </Link>

          <nav>
            <Link href="/">
              Home
            </Link>

            <Link href="/properties">
              Properties
            </Link>

            <Link href="/services">
              Services
            </Link>

            <Link href="/about">
              About
            </Link>

            <Link href="/contact">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {/* BREADCRUMB */}

      <section className="property-breadcrumb">
        <div className="container">
          <Link href="/properties">
            Properties
          </Link>

          <span> / </span>

          <span>
            {property.title}
          </span>
        </div>
      </section>

      {/* MAIN PROPERTY */}

      <section className="property-details-section">
        <div className="container">
          <div className="property-details-grid">
            {/* GALLERY */}

            <div className="property-gallery">
              <div
                className="main-property-image"
                style={{
                  overflow: "hidden",
                }}
              >
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={property.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      display: "grid",
                      placeItems: "center",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <span>
                      PROPERTY IMAGE
                    </span>
                  </div>
                )}

                <small>
                  {property.listing_type ||
                    "Property"}
                </small>
              </div>

              {/* THUMBNAILS */}

              {images.length > 0 && (
                <div className="property-thumbnails">
                  {images.map(
                    (image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() =>
                          setActiveImage(
                            index
                          )
                        }
                        aria-label={`View property image ${
                          index + 1
                        }`}
                        style={{
                          padding: 0,
                          border:
                            activeImage ===
                            index
                              ? "2px solid var(--accent)"
                              : "1px solid transparent",
                          background:
                            "transparent",
                          cursor: "pointer",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={image}
                          alt={`${property.title} ${
                            index + 1
                          }`}
                          loading={
                            index === 0
                              ? "eager"
                              : "lazy"
                          }
                          style={{
                            width: "100%",
                            height: "85px",
                            objectFit: "cover",
                            display:
                              "block",
                          }}
                        />
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* PROPERTY INFORMATION */}

            <div className="property-main-info">
              <p className="listing-type">
                {property.property_type ||
                  "PROPERTY"}
              </p>

              <h1>
                {property.title}
              </h1>

              {displayLocation && (
                <p className="property-main-location">
                  📍 {displayLocation}
                </p>
              )}

              {property.price && (
                <div className="property-price">
                  {property.price}
                </div>
              )}

              <div className="property-specifications">
                <div>
                  <span>BHK</span>

                  <strong>
                    {property.bhk ||
                      property.bedrooms ||
                      "—"}
                  </strong>
                </div>

                <div>
                  <span>AREA</span>

                  <strong>
                    {property.carpet_area ||
                      property.built_up_area ||
                      property.plot_area ||
                      "—"}
                  </strong>
                </div>

                <div>
                  <span>TYPE</span>

                  <strong>
                    {property.property_type ||
                      "—"}
                  </strong>
                </div>
              </div>

              <div className="property-action-buttons">
                <a
                  href={`tel:+91${PHONE}`}
                  className="primary-button"
                >
                  Call Now
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-button"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* EXTRA DETAILS */}

          <section
            style={{
              marginTop: "55px",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "12px",
            }}
          >
            {[
              [
                "Bedrooms",
                property.bedrooms,
              ],
              [
                "Bathrooms",
                property.bathrooms,
              ],
              [
                "Balconies",
                property.balconies,
              ],
              [
                "Floor",
                property.floor,
              ],
              [
                "Total Floors",
                property.total_floors,
              ],
              [
                "Furnishing",
                property.furnishing_status,
              ],
              [
                "Built-up Area",
                property.built_up_area,
              ],
              [
                "Plot Area",
                property.plot_area,
              ],
            ]
              .filter(
                ([, value]) =>
                  value !== null &&
                  value !== undefined &&
                  String(value).trim() !== ""
              )
              .map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    padding: "20px",
                    background: "white",
                    border:
                      "1px solid var(--border)",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "var(--muted)",
                      fontSize: "10px",
                      letterSpacing: "1.5px",
                      textTransform:
                        "uppercase",
                    }}
                  >
                    {label}
                  </span>

                  <strong>
                    {value}
                  </strong>
                </div>
              ))}
          </section>

          {/* DESCRIPTION + ENQUIRY */}

          <div className="property-information-grid">
            <div>
              <p className="section-label">
                PROPERTY DESCRIPTION
              </p>

              <h2>
                About this property
              </h2>

              <p className="property-description">
                {property.description ||
                  "Contact Ultimate Realty UR for complete information about this property."}
              </p>
            </div>

            {/* ENQUIRY */}

            <div className="enquiry-card">
              <p className="section-label">
                INTERESTED?
              </p>

              <h3>
                Send an Enquiry
              </h3>

              <form
                onSubmit={
                  handleEnquirySubmit
                }
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={
                    handleFormChange
                  }
                  required
                  disabled={submitting}
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={
                    handleFormChange
                  }
                  required
                  disabled={submitting}
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={
                    handleFormChange
                  }
                  disabled={submitting}
                />

                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows={4}
                  value={
                    formData.message
                  }
                  onChange={
                    handleFormChange
                  }
                  disabled={submitting}
                />

                <button
                  type="submit"
                  disabled={submitting}
                >
                  {submitting
                    ? "Sending..."
                    : "Send Enquiry →"}
                </button>

                {enquirySuccess && (
                  <p
                    style={{
                      margin: 0,
                      padding: "12px",
                      background:
                        "#eaf7ee",
                      color: "#23643a",
                      fontSize: "13px",
                      lineHeight: 1.5,
                    }}
                  >
                    {enquirySuccess}
                  </p>
                )}

                {enquiryError && (
                  <p
                    style={{
                      margin: 0,
                      padding: "12px",
                      background:
                        "#fff0f0",
                      color: "#a12626",
                      fontSize: "13px",
                      lineHeight: 1.5,
                    }}
                  >
                    {enquiryError}
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* AMENITIES */}

          {property.amenities &&
            property.amenities.length >
              0 && (
              <section className="amenities-section">
                <p className="section-label">
                  PROPERTY FEATURES
                </p>

                <h2>
                  Amenities
                </h2>

                <div className="amenities-grid">
                  {property.amenities.map(
                    (amenity) => (
                      <div
                        key={amenity}
                      >
                        ✓ {amenity}
                      </div>
                    )
                  )}
                </div>
              </section>
            )}

          {/* PROPERTY VIDEO */}

          {videos.length > 0 && (
            <section
              style={{
                marginTop: "100px",
                paddingTop: "80px",
                borderTop:
                  "1px solid var(--border)",
              }}
            >
              <p className="section-label">
                PROPERTY VIDEO
              </p>

              <h2
                style={{
                  margin:
                    "0 0 25px",
                  fontFamily:
                    '"Playfair Display", serif',
                  fontSize: "42px",
                  fontWeight: 500,
                }}
              >
                Take a Virtual Tour
              </h2>

              <div
                style={{
                  display: "grid",
                  gap: "25px",
                }}
              >
                {videos.map(
                  (video, index) => {
                    const youtubeUrl =
                      getYouTubeEmbedUrl(
                        video
                      );

                    if (youtubeUrl) {
                      return (
                        <div
                          key={`${video}-${index}`}
                          style={{
                            width: "100%",
                            aspectRatio:
                              "16 / 9",
                            background:
                              "#111",
                            overflow:
                              "hidden",
                          }}
                        >
                          <iframe
                            src={
                              youtubeUrl
                            }
                            title={`Property video ${
                              index + 1
                            }`}
                            style={{
                              width:
                                "100%",
                              height:
                                "100%",
                              border: "none",
                            }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        </div>
                      );
                    }

                    return (
                      <video
                        key={`${video}-${index}`}
                        src={video}
                        controls
                        preload="metadata"
                        playsInline
                        style={{
                          width: "100%",
                          maxHeight:
                            "650px",
                          background:
                            "#111",
                          display:
                            "block",
                        }}
                      >
                        Your browser does not
                        support video playback.
                      </video>
                    );
                  }
                )}
              </div>
            </section>
          )}

          {/* LOCATION */}

          <section className="map-section">
            <p className="section-label">
              LOCATION
            </p>

            <h2>
              Property Location
            </h2>

            <div
              className="map-placeholder"
              style={{
                position:
                  "relative",
              }}
            >
              <div>
                <strong>
                  {displayLocation ||
                    property.city ||
                    "Pune"}
                </strong>

                <span>
                  {property.pincode
                    ? `Pincode: ${property.pincode}`
                    : "Contact Ultimate Realty UR for location details"}
                </span>

                {property.google_maps_url && (
                  <a
                    href={
                      property.google_maps_url
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginTop:
                        "8px",
                      fontWeight: 700,
                      fontSize:
                        "12px",
                    }}
                  >
                    Open Location →
                  </a>
                )}
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* BOTTOM CTA */}

      <section className="property-contact">
        <div className="container">
          <p className="section-label">
            ULTIMATE REALTY UR
          </p>

          <h2>
            Interested in this property?
          </h2>

          <p>
            Contact our team for more
            information, property visit and
            assistance.
          </p>

          <div>
            <a
              href={`tel:+91${PHONE}`}
            >
              Call {PHONE}
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
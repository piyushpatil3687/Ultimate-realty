"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import styles from "./page.module.css";

type Property = {
  id: string;
  title: string;
  property_type: string;
  listing_type: string;
  price: string;
  location: string;
  city: string;
  bhk: string;
  carpet_area: string;
  built_up_area: string;
  description: string;
  amenities: string[];
  images: string[];
  videos: string[];
  created_at: string;
};

export default function AdminProperties() {
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    checkAdminAndLoadProperties();
  }, []);

  async function checkAdminAndLoadProperties() {
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/admin/login");
      return;
    }

    await loadProperties();
  }

  async function loadProperties() {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Property loading error:", error);
      setError(error.message);
      setLoading(false);
      return;
    }

    setProperties((data as Property[]) || []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property? This action cannot be undone."
    );

    if (!confirmed) return;

    setDeletingId(id);

    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete error:", error);
      alert(`Unable to delete property.\n\n${error.message}`);
      setDeletingId(null);
      return;
    }

    setProperties((current) =>
      current.filter((property) => property.id !== id)
    );

    setDeletingId(null);

    alert("Property deleted successfully.");
  }

  function getFirstImage(property: Property) {
    if (
      Array.isArray(property.images) &&
      property.images.length > 0 &&
      property.images[0]
    ) {
      return property.images[0];
    }

    return null;
  }

  function getPropertyDetails(property: Property) {
    const details: string[] = [];

    if (property.bhk) {
      details.push(property.bhk);
    }

    if (property.carpet_area) {
      details.push(property.carpet_area);
    } else if (property.built_up_area) {
      details.push(property.built_up_area);
    }

    return details.join(" • ");
  }

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  if (loading) {
    return (
      <main className={styles.loading}>
        <div className={styles.loadingBox}>
          <div className={styles.loadingLogo}>UR</div>
          <p>Loading properties...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      {/* ================= DESKTOP / MOBILE HEADER ================= */}

      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <img
            src="/images/ultimate-realty-logo.png"
            alt="Ultimate Realty UR"
            className={styles.brandLogo}
          />

          <div className={styles.brandText}>
            <strong>ULTIMATE REALTY</strong>
            <small>ADMIN PANEL</small>
          </div>
        </div>

        <div className={styles.sidebarLabel}>ADMIN PANEL</div>

        <nav className={styles.navigation}>
          <Link href="/admin" className={styles.navLink}>
            <span>▣</span>
            <strong>Dashboard</strong>
          </Link>

          <Link
            href="/admin/properties"
            className={`${styles.navLink} ${styles.active}`}
          >
            <span>⌂</span>
            <strong>Properties</strong>
          </Link>

          <Link href="/admin/enquiries" className={styles.navLink}>
            <span>▤</span>
            <strong>Enquiries</strong>
          </Link>

          <Link href="/admin/reviews" className={styles.navLink}>
            <span>★</span>
            <strong>Reviews</strong>
          </Link>
        </nav>

        <div className={styles.sidebarBottom}>
          <Link href="/" target="_blank">
            View Website ↗
          </Link>

          <button onClick={logout}>Logout</button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <section className={styles.content}>
        {/* TOP HEADER */}

        <header className={styles.topbar}>
          <div className={styles.heading}>
            <p>PROPERTY MANAGEMENT</p>

            <h1>Properties</h1>

            <span>
              Add, edit and manage all properties displayed on your website.
            </span>
          </div>

          <button
            onClick={() => router.push("/admin/properties/new")}
            className={styles.addButton}
          >
            + Add Property
          </button>
        </header>

        {/* MOBILE NAVIGATION */}

        <div className={styles.mobileNavigation}>
          <Link href="/admin">
            <span>▣</span>
            Dashboard
          </Link>

          <Link href="/admin/properties" className={styles.mobileActive}>
            <span>⌂</span>
            Properties
          </Link>

          <Link href="/admin/enquiries">
            <span>▤</span>
            Enquiries
          </Link>

          <Link href="/admin/reviews">
            <span>★</span>
            Reviews
          </Link>
        </div>

        {/* ERROR */}

        {error && (
          <section className={styles.errorBox}>
            <strong>Unable to load properties</strong>

            <p>{error}</p>

            <button onClick={loadProperties}>Try Again</button>
          </section>
        )}

        {!error && (
          <>
            {/* ================= STATISTICS ================= */}

            <section className={styles.stats}>
              <div className={styles.statCard}>
                <span>TOTAL PROPERTIES</span>
                <strong>{properties.length}</strong>
                <small>All listings</small>
              </div>

              <div className={styles.statCard}>
                <span>FOR SALE</span>
                <strong>
                  {
                    properties.filter(
                      (property) =>
                        property.listing_type?.toLowerCase() === "sale"
                    ).length
                  }
                </strong>
                <small>Sale listings</small>
              </div>

              <div className={styles.statCard}>
                <span>FOR RENT</span>
                <strong>
                  {
                    properties.filter(
                      (property) =>
                        property.listing_type?.toLowerCase() === "rent"
                    ).length
                  }
                </strong>
                <small>Rental listings</small>
              </div>
            </section>

            {/* ================= PROPERTY SECTION ================= */}

            <section className={styles.section}>
              <div className={styles.sectionHeading}>
                <div>
                  <p>LISTINGS</p>

                  <h2>
                    {properties.length}{" "}
                    {properties.length === 1 ? "Property" : "Properties"}
                  </h2>
                </div>

                <button
                  onClick={() => router.push("/admin/properties/new")}
                  className={styles.sectionAddButton}
                >
                  + Add
                </button>
              </div>

              {/* EMPTY STATE */}

              {properties.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>⌂</div>

                  <h3>No properties added yet</h3>

                  <p>
                    Start building your property portfolio by adding your
                    first listing.
                  </p>

                  <button
                    onClick={() =>
                      router.push("/admin/properties/new")
                    }
                    className={styles.addButton}
                  >
                    + Add First Property
                  </button>
                </div>
              ) : (
                <div className={styles.propertyGrid}>
                  {properties.map((property) => {
                    const image = getFirstImage(property);
                    const details = getPropertyDetails(property);

                    return (
                      <article
                        key={property.id}
                        className={styles.propertyCard}
                      >
                        {/* IMAGE */}

                        <div className={styles.propertyImage}>
                          {image ? (
                            <img
                              src={image}
                              alt={property.title || "Property"}
                            />
                          ) : (
                            <div className={styles.noImage}>
                              <strong>UR</strong>
                              <span>No Image</span>
                            </div>
                          )}

                          <span className={styles.badge}>
                            {property.listing_type || "Listing"}
                          </span>
                        </div>

                        {/* DETAILS */}

                        <div className={styles.propertyBody}>
                          <p className={styles.propertyType}>
                            {property.property_type || "Property"}
                          </p>

                          <h3>
                            {property.title || "Untitled Property"}
                          </h3>

                          <p className={styles.location}>
                            {property.location || "Location not specified"}

                            {property.city ? `, ${property.city}` : ""}
                          </p>

                          {details && (
                            <p className={styles.details}>{details}</p>
                          )}

                          <div className={styles.price}>
                            {property.price || "Price on request"}
                          </div>

                          {/* ACTIONS */}

                          <div className={styles.actions}>
                            <button
                              onClick={() =>
                                router.push(
                                  `/admin/properties/edit/${property.id}`
                                )
                              }
                              className={styles.editButton}
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDelete(property.id)}
                              disabled={deletingId === property.id}
                              className={styles.deleteButton}
                            >
                              {deletingId === property.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </section>
    </main>
  );
}
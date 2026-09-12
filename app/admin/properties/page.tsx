"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  carpet_area: string | null;
  built_up_area: string | null;
  images: string[] | null;
  created_at: string;
};

export default function AdminPropertiesPage() {
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    checkAuthAndLoadProperties();
  }, []);

  async function checkAuthAndLoadProperties() {
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
        images,
        created_at
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setError("Unable to load properties.");
      setProperties([]);
    } else {
      setProperties((data as Property[]) || []);
    }

    setLoading(false);
  }

  async function handleDelete(property: Property) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${property.title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(property.id);
    setError("");

    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", property.id);

    if (error) {
      console.error(error);
      setError(`Unable to delete property: ${error.message}`);
      setDeletingId(null);
      return;
    }

    setProperties((current) =>
      current.filter((item) => item.id !== property.id)
    );

    setDeletingId(null);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  function getImage(property: Property) {
    if (property.images && property.images.length > 0) {
      return property.images[0];
    }

    return "/property-placeholder.jpg";
  }

  return (
    <div style={styles.page}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.logoCircle}>
            <img
              src="/image/ultimate-realty-logo.png"
              alt="Ultimate Realty"
              style={styles.logoImage}
            />
          </div>

          <div>
            <div style={styles.brandName}>ULTIMATE REALTY</div>
            <div style={styles.brandSub}>ADMIN PANEL</div>
          </div>
        </div>

        <nav style={styles.sidebarNav}>
          <Link href="/admin" style={styles.navItem}>
            <span>▣</span>
            Dashboard
          </Link>

          <Link
            href="/admin/properties"
            style={{ ...styles.navItem, ...styles.activeNavItem }}
          >
            <span>⌂</span>
            Properties
          </Link>

          <Link href="/admin/enquiries" style={styles.navItem}>
            <span>✉</span>
            Enquiries
          </Link>

          <Link href="/admin/reviews" style={styles.navItem}>
            <span>★</span>
            Reviews
          </Link>
        </nav>

        <div style={styles.sidebarBottom}>
          <Link href="/" target="_blank" style={styles.viewWebsite}>
            View Website ↗
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            style={styles.logoutButton}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={styles.main}>
        {/* TOP BAR */}
        <header style={styles.topBar}>
          <div>
            <p style={styles.pageLabel}>PROPERTY MANAGEMENT</p>
            <h1 style={styles.pageTitle}>Properties</h1>
            <p style={styles.pageDescription}>
              Add, edit and manage all properties displayed on your website.
            </p>
          </div>

          <Link href="/admin/properties/new" style={styles.addButton}>
            + Add New Property
          </Link>
        </header>

        {/* STATS */}
        <section style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>⌂</div>
            <div>
              <span style={styles.statLabel}>TOTAL PROPERTIES</span>
              <strong style={styles.statNumber}>{properties.length}</strong>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>₹</div>
            <div>
              <span style={styles.statLabel}>FOR SALE</span>
              <strong style={styles.statNumber}>
                {
                  properties.filter(
                    (property) =>
                      property.listing_type?.toLowerCase() === "sale"
                  ).length
                }
              </strong>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>↗</div>
            <div>
              <span style={styles.statLabel}>FOR RENT</span>
              <strong style={styles.statNumber}>
                {
                  properties.filter(
                    (property) =>
                      property.listing_type?.toLowerCase() === "rent"
                  ).length
                }
              </strong>
            </div>
          </div>
        </section>

        {/* ERROR */}
        {error && (
          <div style={styles.errorBox}>
            <strong>Error</strong>
            <span>{error}</span>
            <button
              type="button"
              onClick={loadProperties}
              style={styles.retryButton}
            >
              Try Again
            </button>
          </div>
        )}

        {/* PROPERTY LIST */}
        <section style={styles.contentCard}>
          <div style={styles.contentHeader}>
            <div>
              <h2 style={styles.contentTitle}>All Properties</h2>
              <p style={styles.contentSubtitle}>
                Manage your property listings from here.
              </p>
            </div>

            <span style={styles.countBadge}>
              {properties.length}{" "}
              {properties.length === 1 ? "Property" : "Properties"}
            </span>
          </div>

          {loading ? (
            <div style={styles.loadingBox}>
              <div style={styles.loader}></div>
              <p>Loading properties...</p>
            </div>
          ) : properties.length === 0 ? (
            <div style={styles.emptyBox}>
              <div style={styles.emptyIcon}>⌂</div>
              <h3>No Properties Added Yet</h3>
              <p>
                Start adding your property listings to display them on the
                website.
              </p>

              <Link
                href="/admin/properties/new"
                style={styles.emptyAddButton}
              >
                + Add Your First Property
              </Link>
            </div>
          ) : (
            <div style={styles.propertyList}>
              {properties.map((property) => (
                <article key={property.id} style={styles.propertyCard}>
                  {/* IMAGE */}
                  <div style={styles.imageContainer}>
                    <img
                      src={getImage(property)}
                      alt={property.title}
                      style={styles.propertyImage}
                    />

                    <span
                      style={{
                        ...styles.listingBadge,
                        background:
                          property.listing_type?.toLowerCase() === "rent"
                            ? "#2563eb"
                            : "#111827",
                      }}
                    >
                      {property.listing_type || "Property"}
                    </span>
                  </div>

                  {/* INFORMATION */}
                  <div style={styles.propertyInfo}>
                    <div style={styles.propertyTop}>
                      <div>
                        <span style={styles.propertyType}>
                          {property.property_type || "Property"}
                        </span>

                        <h3 style={styles.propertyTitle}>
                          {property.title}
                        </h3>

                        <p style={styles.location}>
                          📍 {property.location || "Pune"}
                          {property.city ? `, ${property.city}` : ""}
                        </p>
                      </div>

                      <div style={styles.priceBlock}>
                        <span style={styles.priceLabel}>PRICE</span>
                        <strong>
                          {property.price || "Price on Request"}
                        </strong>
                      </div>
                    </div>

                    {/* DETAILS */}
                    <div style={styles.detailsRow}>
                      {property.bhk && (
                        <div style={styles.detailItem}>
                          <strong>{property.bhk}</strong>
                          <span>BHK</span>
                        </div>
                      )}

                      {property.carpet_area && (
                        <div style={styles.detailItem}>
                          <strong>{property.carpet_area}</strong>
                          <span>Carpet Area</span>
                        </div>
                      )}

                      {property.built_up_area && (
                        <div style={styles.detailItem}>
                          <strong>{property.built_up_area}</strong>
                          <span>Built-up Area</span>
                        </div>
                      )}

                      <div style={styles.detailItem}>
                        <strong>{property.images?.length || 0}</strong>
                        <span>Photos</span>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div style={styles.actions}>
                      <Link
                        href={`/properties/${property.id}`}
                        target="_blank"
                        style={styles.viewButton}
                      >
                        👁 View
                      </Link>

                      <Link
                        href={`/admin/properties/edit/${property.id}`}
                        style={styles.editButton}
                      >
                        ✎ Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(property)}
                        disabled={deletingId === property.id}
                        style={{
                          ...styles.deleteButton,
                          opacity:
                            deletingId === property.id ? 0.6 : 1,
                          cursor:
                            deletingId === property.id
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        {deletingId === property.id
                          ? "Deleting..."
                          : "🗑 Delete"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

/* =========================
   INLINE STYLES
========================= */

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f5f6f8",
    color: "#111827",
    display: "flex",
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },

  sidebar: {
    width: "250px",
    minHeight: "100vh",
    background: "#111827",
    color: "#fff",
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    position: "sticky",
    top: 0,
    alignSelf: "flex-start",
    boxSizing: "border-box",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "4px 8px 28px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },

  logoCircle: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
  },

  logoImage: {
    width: "36px",
    height: "36px",
    objectFit: "contain",
    display: "block",
  },

  brandName: {
    fontSize: "13px",
    fontWeight: 800,
    letterSpacing: "0.05em",
  },

  brandSub: {
    marginTop: "3px",
    fontSize: "10px",
    color: "#9ca3af",
    letterSpacing: "0.15em",
  },

  sidebarNav: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginTop: "28px",
  },

  navItem: {
    textDecoration: "none",
    color: "#cbd5e1",
    padding: "13px 14px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "14px",
    fontWeight: 600,
  },

  activeNavItem: {
    background: "#fff",
    color: "#111827",
  },

  sidebarBottom: {
    marginTop: "auto",
    paddingTop: "25px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  viewWebsite: {
    color: "#d1d5db",
    textDecoration: "none",
    padding: "11px 12px",
    fontSize: "13px",
  },

  logoutButton: {
    border: "1px solid rgba(255,255,255,0.15)",
    background: "transparent",
    color: "#fff",
    padding: "11px 12px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "13px",
  },

  main: {
    flex: 1,
    minWidth: 0,
    padding: "34px",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "28px",
  },

  pageLabel: {
    margin: 0,
    color: "#6b7280",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "0.15em",
  },

  pageTitle: {
    margin: "6px 0 4px",
    fontSize: "32px",
    lineHeight: 1.1,
    fontWeight: 800,
  },

  pageDescription: {
    margin: 0,
    color: "#6b7280",
    fontSize: "14px",
  },

  addButton: {
    textDecoration: "none",
    background: "#111827",
    color: "#fff",
    padding: "13px 18px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },

  statCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  statIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "10px",
    background: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  statLabel: {
    display: "block",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "0.08em",
    color: "#6b7280",
  },

  statNumber: {
    display: "block",
    fontSize: "24px",
    marginTop: "3px",
  },

  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    borderRadius: "10px",
    padding: "14px 16px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },

  retryButton: {
    marginLeft: "auto",
    border: "1px solid #fecaca",
    background: "#fff",
    color: "#991b1b",
    borderRadius: "6px",
    padding: "7px 12px",
    cursor: "pointer",
  },

  contentCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    overflow: "hidden",
  },

  contentHeader: {
    padding: "22px 24px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
  },

  contentTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 800,
  },

  contentSubtitle: {
    margin: "5px 0 0",
    color: "#6b7280",
    fontSize: "13px",
  },

  countBadge: {
    background: "#f3f4f6",
    color: "#374151",
    padding: "7px 11px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 700,
  },

  loadingBox: {
    padding: "70px 20px",
    textAlign: "center",
    color: "#6b7280",
  },

  loader: {
    width: "30px",
    height: "30px",
    border: "3px solid #e5e7eb",
    borderTop: "3px solid #111827",
    borderRadius: "50%",
    margin: "0 auto 15px",
  },

  emptyBox: {
    padding: "75px 20px",
    textAlign: "center",
  },

  emptyIcon: {
    fontSize: "42px",
    marginBottom: "12px",
  },

  emptyAddButton: {
    display: "inline-block",
    marginTop: "12px",
    background: "#111827",
    color: "#fff",
    textDecoration: "none",
    padding: "12px 17px",
    borderRadius: "7px",
    fontWeight: 700,
    fontSize: "13px",
  },

  propertyList: {
    display: "flex",
    flexDirection: "column",
  },

  propertyCard: {
    display: "flex",
    gap: "22px",
    padding: "22px 24px",
    borderBottom: "1px solid #e5e7eb",
  },

  imageContainer: {
    width: "220px",
    height: "165px",
    flexShrink: 0,
    position: "relative",
    overflow: "hidden",
    borderRadius: "9px",
    background: "#e5e7eb",
  },

  propertyImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  listingBadge: {
    position: "absolute",
    top: "10px",
    left: "10px",
    color: "#fff",
    padding: "5px 9px",
    borderRadius: "5px",
    fontSize: "10px",
    fontWeight: 800,
    textTransform: "uppercase",
  },

  propertyInfo: {
    flex: 1,
    minWidth: 0,
  },

  propertyTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
  },

  propertyType: {
    color: "#6b7280",
    fontSize: "10px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },

  propertyTitle: {
    margin: "5px 0",
    fontSize: "20px",
    fontWeight: 800,
    lineHeight: 1.2,
  },

  location: {
    margin: 0,
    color: "#6b7280",
    fontSize: "13px",
  },

  priceBlock: {
    textAlign: "right",
    flexShrink: 0,
  },

  priceLabel: {
    display: "block",
    fontSize: "9px",
    color: "#9ca3af",
    fontWeight: 800,
    letterSpacing: "0.08em",
    marginBottom: "3px",
  },

  detailsRow: {
    display: "flex",
    gap: "0",
    marginTop: "18px",
    borderTop: "1px solid #f0f0f0",
    borderBottom: "1px solid #f0f0f0",
    padding: "12px 0",
  },

  detailItem: {
    minWidth: "105px",
    paddingRight: "18px",
    marginRight: "18px",
    borderRight: "1px solid #e5e7eb",
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    marginTop: "16px",
  },

  viewButton: {
    textDecoration: "none",
    border: "1px solid #d1d5db",
    color: "#374151",
    background: "#fff",
    padding: "8px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: 700,
  },

  editButton: {
    textDecoration: "none",
    border: "1px solid #111827",
    color: "#fff",
    background: "#111827",
    padding: "8px 14px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: 700,
  },

  deleteButton: {
    border: "1px solid #fecaca",
    color: "#b91c1c",
    background: "#fff",
    padding: "8px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: 700,
  },
};
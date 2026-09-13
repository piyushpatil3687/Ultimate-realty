"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import styles from "./page.module.css";

type Enquiry = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  requirement: string | null;
  property_type: string | null;
  preferred_location: string | null;
  budget: string | null;
};

export default function AdminEnquiries() {
  const router = useRouter();

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    checkAdminAndLoadEnquiries();
  }, []);

  async function checkAdminAndLoadEnquiries() {
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/admin/login");
      return;
    }

    await loadEnquiries();
  }

  async function loadEnquiries() {
    setRefreshing(true);
    setError("");

    const { data, error } = await supabase
      .from("enquiries")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Enquiry loading error:", error);
      setError(error.message);
      setRefreshing(false);
      setLoading(false);
      return;
    }

    setEnquiries((data as Enquiry[]) || []);
    setRefreshing(false);
    setLoading(false);
  }

  async function handleDeleteEnquiry(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this enquiry?\n\nThis action cannot be undone."
    );

    if (!confirmed) return;

    setDeletingId(id);

    const { error } = await supabase
      .from("enquiries")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete enquiry error:", error);

      alert(`Unable to delete enquiry.\n\n${error.message}`);

      setDeletingId(null);
      return;
    }

    setEnquiries((current) =>
      current.filter((enquiry) => enquiry.id !== id)
    );

    setDeletingId(null);

    alert("Enquiry deleted successfully.");
  }

  function getInitials(name: string) {
    if (!name) return "U";

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return (
      parts[0].charAt(0) +
      parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  }

  function getRequirement(enquiry: Enquiry) {
    if (!enquiry.requirement) {
      return "Customer enquiry";
    }

    const text = enquiry.requirement;

    if (text.includes("Message:")) {
      return text
        .split("Message:")[0]
        .replace("Requirement:", "")
        .trim();
    }

    return text;
  }

  function getMessage(enquiry: Enquiry) {
    if (!enquiry.requirement) return "";

    if (enquiry.requirement.includes("Message:")) {
      return enquiry.requirement
        .split("Message:")
        .slice(1)
        .join("Message:")
        .trim();
    }

    return "";
  }

  function handleCall(phone: string) {
    if (!phone) return;

    window.location.href = `tel:${phone}`;
  }

  function handleWhatsApp(phone: string) {
    if (!phone) return;

    const cleanPhone = phone.replace(/\D/g, "");

    const whatsappNumber =
      cleanPhone.length === 10
        ? `91${cleanPhone}`
        : cleanPhone;

    window.open(
      `https://wa.me/${whatsappNumber}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function handleEmail(email: string | null) {
    if (!email) return;

    window.location.href = `mailto:${email}`;
  }

  if (loading) {
    return (
      <main className={styles.loadingPage}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading enquiries...</p>
      </main>
    );
  }

  return (
    <div className={styles.page}>
      {/* ================= SIDEBAR ================= */}

      <aside className={styles.sidebar}>
        <a href="/admin" className={styles.adminBrand}>
          <div className={styles.adminLogoCircle}>
            <img
              src="/images/ultimate-realty-logo.png"
              alt="Ultimate Realty UR"
              className={styles.adminLogo}
            />
          </div>

          <div className={styles.adminBrandText}>
            <strong>ULTIMATE REALTY</strong>
            <small>UR • ADMIN</small>
          </div>
        </a>

        <div className={styles.sidebarLabel}>
          ADMIN PANEL
        </div>

        <nav className={styles.navigation}>
          <a href="/admin" className={styles.navItem}>
            <span>▣</span>
            Dashboard
          </a>

          <a
            href="/admin/properties"
            className={styles.navItem}
          >
            <span>⌂</span>
            Properties
          </a>

          <a
            href="/admin/enquiries"
            className={`${styles.navItem} ${styles.activeNav}`}
          >
            <span>✉</span>
            Enquiries
          </a>

          <a
            href="/admin/reviews"
            className={styles.navItem}
          >
            <span>★</span>
            Reviews
          </a>
        </nav>

        <div className={styles.sidebarBottom}>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className={styles.websiteButton}
          >
            View Website ↗
          </a>

          <button
            type="button"
            className={styles.logoutButton}
            onClick={async () => {
              await supabase.auth.signOut();
              router.replace("/admin/login");
              router.refresh();
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}

      <main className={styles.main}>
        {/* HEADER */}

        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>
              LEAD MANAGEMENT
            </p>

            <h1 className={styles.pageTitle}>
              Enquiries
            </h1>

            <p className={styles.subtitle}>
              Manage customer enquiries and follow up with
              potential property buyers and tenants.
            </p>
          </div>

          <button
            type="button"
            className={styles.refreshButton}
            onClick={loadEnquiries}
            disabled={refreshing}
          >
            <span
              className={
                refreshing ? styles.spinning : ""
              }
            >
              ↻
            </span>

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </header>

        {/* SUMMARY */}

        <section className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>
              ◉
            </div>

            <div>
              <span>Total Enquiries</span>
              <strong>{enquiries.length}</strong>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>
              ↗
            </div>

            <div>
              <span>Property Leads</span>
              <strong>
                {
                  enquiries.filter(
                    (item) => item.property_type
                  ).length
                }
              </strong>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>
              ☎
            </div>

            <div>
              <span>Contactable Leads</span>
              <strong>
                {
                  enquiries.filter(
                    (item) => item.phone
                  ).length
                }
              </strong>
            </div>
          </div>
        </section>

        {/* ERROR */}

        {error && (
          <section className={styles.errorBox}>
            <div>
              <strong>
                Unable to load enquiries
              </strong>

              <p>{error}</p>
            </div>

            <button
              type="button"
              onClick={loadEnquiries}
            >
              Try Again
            </button>
          </section>
        )}

        {/* CUSTOMER LEADS */}

        {!error && (
          <section className={styles.enquiriesSection}>
            <div className={styles.sectionHeader}>
              <div>
                <span className={styles.sectionLabel}>
                  CUSTOMER LEADS
                </span>

                <h2>
                  {enquiries.length}{" "}
                  {enquiries.length === 1
                    ? "Enquiry"
                    : "Enquiries"}
                </h2>
              </div>

              <span className={styles.liveBadge}>
                ● Live
              </span>
            </div>

            {/* EMPTY */}

            {enquiries.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  ✉
                </div>

                <h3>No enquiries yet</h3>

                <p>
                  Customer enquiries submitted through
                  your website will appear here.
                </p>
              </div>
            ) : (
              <div className={styles.enquiryList}>
                {enquiries.map((enquiry, index) => {
                  const message =
                    getMessage(enquiry);

                  return (
                    <article
                      key={enquiry.id}
                      className={styles.enquiryCard}
                    >
                      {/* CARD HEADER */}

                      <div className={styles.cardHeader}>
                        <div className={styles.customerInfo}>
                          <div className={styles.avatar}>
                            {getInitials(
                              enquiry.name
                            )}
                          </div>

                          <div>
                            <div className={styles.leadNumber}>
                              LEAD #
                              {String(index + 1).padStart(
                                2,
                                "0"
                              )}
                            </div>

                            <h3>
                              {enquiry.name ||
                                "Unknown Customer"}
                            </h3>

                            <span
                              className={
                                styles.customerType
                              }
                            >
                              Property Enquiry
                            </span>
                          </div>
                        </div>

                        <div className={styles.newBadge}>
                          NEW
                        </div>
                      </div>

                      {/* CONTACT */}

                      <div className={styles.contactGrid}>
                        <div className={styles.contactItem}>
                          <span
                            className={
                              styles.contactIcon
                            }
                          >
                            ☎
                          </span>

                          <div>
                            <small>PHONE</small>

                            {enquiry.phone ? (
                              <button
                                type="button"
                                className={
                                  styles.contactLink
                                }
                                onClick={() =>
                                  handleCall(
                                    enquiry.phone
                                  )
                                }
                              >
                                {enquiry.phone}
                              </button>
                            ) : (
                              <span
                                className={
                                  styles.notAvailable
                                }
                              >
                                Not provided
                              </span>
                            )}
                          </div>
                        </div>

                        <div className={styles.contactItem}>
                          <span
                            className={
                              styles.contactIcon
                            }
                          >
                            ✉
                          </span>

                          <div>
                            <small>EMAIL</small>

                            {enquiry.email ? (
                              <button
                                type="button"
                                className={
                                  styles.contactLink
                                }
                                onClick={() =>
                                  handleEmail(
                                    enquiry.email
                                  )
                                }
                              >
                                {enquiry.email}
                              </button>
                            ) : (
                              <span
                                className={
                                  styles.notAvailable
                                }
                              >
                                Not provided
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* PROPERTY DETAILS */}

                      <div className={styles.detailsSection}>
                        <div className={styles.detailItem}>
                          <span>PROPERTY TYPE</span>

                          <strong>
                            {enquiry.property_type ||
                              "Not specified"}
                          </strong>
                        </div>

                        <div className={styles.detailItem}>
                          <span>PREFERRED LOCATION</span>

                          <strong>
                            {enquiry.preferred_location ||
                              "Not specified"}
                          </strong>
                        </div>

                        <div className={styles.detailItem}>
                          <span>BUDGET</span>

                          <strong>
                            {enquiry.budget ||
                              "Not specified"}
                          </strong>
                        </div>

                        <div className={styles.detailItem}>
                          <span>REQUIREMENT</span>

                          <strong>
                            {getRequirement(enquiry)}
                          </strong>
                        </div>
                      </div>

                      {/* MESSAGE */}

                      {message && (
                        <div className={styles.messageBox}>
                          <span>
                            CUSTOMER MESSAGE
                          </span>

                          <p>“{message}”</p>
                        </div>
                      )}

                      {/* FOOTER */}

                      <div className={styles.cardFooter}>
                        <div className={styles.followUpText}>
                          Follow up with this customer
                        </div>

                        <div className={styles.actionButtons}>
                          <button
                            type="button"
                            className={styles.callButton}
                            onClick={() =>
                              handleCall(
                                enquiry.phone
                              )
                            }
                          >
                            <span>☎</span>
                            Call
                          </button>

                          <button
                            type="button"
                            className={
                              styles.whatsappButton
                            }
                            onClick={() =>
                              handleWhatsApp(
                                enquiry.phone
                              )
                            }
                          >
                            <span>◉</span>
                            WhatsApp
                          </button>

                          {enquiry.email && (
                            <button
                              type="button"
                              className={styles.emailButton}
                              onClick={() =>
                                handleEmail(
                                  enquiry.email
                                )
                              }
                            >
                              <span>✉</span>
                              Email
                            </button>
                          )}

                          <button
                            type="button"
                            className={styles.deleteButton}
                            onClick={() =>
                              handleDeleteEnquiry(
                                enquiry.id
                              )
                            }
                            disabled={
                              deletingId ===
                              enquiry.id
                            }
                          >
                            <span>🗑</span>

                            {deletingId === enquiry.id
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
        )}
      </main>
    </div>
  );
}
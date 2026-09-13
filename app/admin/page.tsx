"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import styles from "./page.module.css";

export default function AdminDashboard() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [propertyCount, setPropertyCount] = useState(0);
  const [enquiryCount, setEnquiryCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/admin/login");
      return;
    }

    setEmail(user.email || "");

    const { count: properties } = await supabase
      .from("properties")
      .select("*", {
        count: "exact",
        head: true,
      });

    const { count: enquiries } = await supabase
      .from("enquiries")
      .select("*", {
        count: "exact",
        head: true,
      });

    const { count: reviews } = await supabase
      .from("reviews")
      .select("*", {
        count: "exact",
        head: true,
      });

    setPropertyCount(properties || 0);
    setEnquiryCount(enquiries || 0);
    setReviewCount(reviews || 0);

    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();

    router.replace("/admin/login");
    router.refresh();
  }

  if (loading) {
    return (
      <main className={styles.loading}>
        <div className={styles.loadingBox}>
          <div className={styles.loadingLogo}>
            <img
              src="/images/ultimate-realty-logo.png"
              alt="Ultimate Realty UR"
            />
          </div>
          <p>Loading Ultimate Realty Admin...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.dashboard}>

      {/* SIDEBAR */}
      <aside className={styles.sidebar}>

        <Link href="/admin" className={styles.brand}>
          <div className={styles.logoCircle}>
            <img
              src="/images/ultimate-realty-logo.png"
              alt="Ultimate Realty UR"
            />
          </div>

          <div className={styles.brandText}>
            <strong>ULTIMATE REALTY</strong>
            <span>UR • ADMIN</span>
          </div>
        </Link>

        <div className={styles.sidebarDivider} />

        <div className={styles.sidebarLabel}>
          ADMIN PANEL
        </div>

        <nav className={styles.navigation}>

          <Link
            href="/admin"
            className={`${styles.navLink} ${styles.active}`}
          >
            <span className={styles.navIcon}>▣</span>
            <span>Dashboard</span>
          </Link>

          <Link href="/admin/properties" className={styles.navLink}>
            <span className={styles.navIcon}>⌂</span>
            <span>Properties</span>
          </Link>

          <Link href="/admin/enquiries" className={styles.navLink}>
            <span className={styles.navIcon}>≡</span>
            <span>Enquiries</span>
          </Link>

          <Link href="/admin/reviews" className={styles.navLink}>
            <span className={styles.navIcon}>★</span>
            <span>Reviews</span>
          </Link>

        </nav>

        <div className={styles.sidebarBottom}>

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.websiteLink}
          >
            View Website ↗
          </Link>

          <button
            onClick={handleLogout}
            className={styles.logoutButton}
          >
            Logout
          </button>

        </div>

      </aside>


      {/* MAIN CONTENT */}
      <section className={styles.content}>

        {/* TOP BAR */}
        <header className={styles.topbar}>

          <div>
            <p className={styles.eyebrow}>
              ADMINISTRATION
            </p>

            <h1>
              Dashboard
            </h1>
          </div>

          <div className={styles.userBox}>
            <span>Logged in as</span>
            <strong>{email}</strong>
          </div>

        </header>


        {/* STATS */}
        <section className={styles.stats}>

          <div className={styles.statCard}>
            <p>PROPERTIES</p>
            <strong>{propertyCount}</strong>
            <span>Total listed properties</span>
          </div>

          <div className={styles.statCard}>
            <p>ENQUIRIES</p>
            <strong>{enquiryCount}</strong>
            <span>Customer enquiries</span>
          </div>

          <div className={styles.statCard}>
            <p>REVIEWS</p>
            <strong>{reviewCount}</strong>
            <span>Customer reviews</span>
          </div>

          <div className={styles.statCard}>
            <p>STATUS</p>
            <strong>Active</strong>
            <span>Website administration</span>
          </div>

        </section>


        {/* QUICK ACTIONS */}
        <section className={styles.quickSection}>

          <div className={styles.sectionHeader}>
            <p>QUICK ACTIONS</p>
            <h2>Manage Ultimate Realty</h2>
          </div>

          <div className={styles.actionsGrid}>

            <Link
              href="/admin/properties/new"
              className={styles.actionCard}
            >
              <div className={styles.actionIcon}>+</div>

              <div>
                <h3>Add Property</h3>
                <p>Add a new property listing.</p>
              </div>

              <span className={styles.actionArrow}>→</span>
            </Link>


            <Link
              href="/admin/properties"
              className={styles.actionCard}
            >
              <div className={styles.actionIcon}>⌂</div>

              <div>
                <h3>Manage Properties</h3>
                <p>Edit and manage existing listings.</p>
              </div>

              <span className={styles.actionArrow}>→</span>
            </Link>


            <Link
              href="/admin/enquiries"
              className={styles.actionCard}
            >
              <div className={styles.actionIcon}>≡</div>

              <div>
                <h3>View Enquiries</h3>
                <p>Review customer enquiries.</p>
              </div>

              <span className={styles.actionArrow}>→</span>
            </Link>


            <Link
              href="/admin/reviews"
              className={styles.actionCard}
            >
              <div className={styles.actionIcon}>★</div>

              <div>
                <h3>Manage Reviews</h3>
                <p>Approve and manage customer reviews.</p>
              </div>

              <span className={styles.actionArrow}>→</span>
            </Link>

          </div>

        </section>


        {/* INFORMATION */}
        <section className={styles.infoSection}>

          <div>
            <p>ULTIMATE REALTY UR</p>

            <h2>
              Property management
              <br />
              made simple.
            </h2>
          </div>

          <div className={styles.infoText}>
            <p>
              Use the admin panel to manage property listings,
              update property information, review customer
              enquiries and manage customer reviews from one place.
            </p>
          </div>

        </section>

      </section>

    </main>
  );
}
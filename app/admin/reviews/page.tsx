"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import styles from "./page.module.css";

type Review = {
  id: string;
  customer_name: string;
  rating: number;
  review: string;
  approved: boolean;
  created_at: string;
};

export default function AdminReviewsPage() {
  const router = useRouter();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    checkAdminAndLoadReviews();
  }, []);

  async function checkAdminAndLoadReviews() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/admin/login");
      return;
    }

    await loadReviews();
  }

  async function loadReviews() {
    setLoading(true);

    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading reviews:", error);
      alert("Could not load reviews.");
      setLoading(false);
      return;
    }

    setReviews(data || []);
    setLoading(false);
  }

  async function toggleApproval(review: Review) {
    setActionId(review.id);

    const { error } = await supabase
      .from("reviews")
      .update({
        approved: !review.approved,
      })
      .eq("id", review.id);

    if (error) {
      console.error("Approval update error:", error);
      alert("Could not update review.");
      setActionId(null);
      return;
    }

    setReviews((current) =>
      current.map((item) =>
        item.id === review.id
          ? { ...item, approved: !item.approved }
          : item
      )
    );

    setActionId(null);
  }

  async function deleteReview(review: Review) {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete the review from ${review.customer_name}?`
    );

    if (!confirmed) return;

    setActionId(review.id);

    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", review.id);

    if (error) {
      console.error("Delete review error:", error);
      alert("Could not delete review.");
      setActionId(null);
      return;
    }

    setReviews((current) =>
      current.filter((item) => item.id !== review.id)
    );

    setActionId(null);
  }

  const totalReviews = reviews.length;
  const approvedReviews = reviews.filter(
    (review) => review.approved
  ).length;
  const pendingReviews = reviews.filter(
    (review) => !review.approved
  ).length;

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function renderStars(rating: number) {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  }

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.logoCircle}>
            <img
              src="/image/ultimate-realty-logo.png"
              alt="Ultimate Realty"
            />
          </div>

          <div>
            <h2>Ultimate Realty</h2>
            <span>ADMIN PANEL</span>
          </div>
        </div>

        <nav className={styles.navigation}>
          <button onClick={() => router.push("/admin")}>
            <span>▣</span>
            Dashboard
          </button>

          <button onClick={() => router.push("/admin/properties")}>
            <span>⌂</span>
            Properties
          </button>

          <button onClick={() => router.push("/admin/enquiries")}>
            <span>☏</span>
            Enquiries
          </button>

          <button className={styles.active}>
            <span>★</span>
            Reviews
          </button>
        </nav>

        <div className={styles.sidebarBottom}>
          <button
            className={styles.backButton}
            onClick={() => router.push("/")}
          >
            ← View Website
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1>Customer Reviews</h1>
            <p>
              Review customer feedback, approve genuine reviews and
              manage published testimonials.
            </p>
          </div>

          <button
            className={styles.refreshButton}
            onClick={loadReviews}
          >
            ↻ Refresh
          </button>
        </header>

        {/* Summary Cards */}
        <section className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>★</div>
            <div>
              <span>Total Reviews</span>
              <strong>{totalReviews}</strong>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>✓</div>
            <div>
              <span>Approved</span>
              <strong>{approvedReviews}</strong>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>!</div>
            <div>
              <span>Pending Review</span>
              <strong>{pendingReviews}</strong>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className={styles.reviewSection}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Review Management</h2>
              <p>
                Approve reviews before they appear publicly on the
                website.
              </p>
            </div>

            {pendingReviews > 0 && (
              <span className={styles.pendingBadge}>
                {pendingReviews} Pending
              </span>
            )}
          </div>

          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>★</div>
              <h3>No Reviews Yet</h3>
              <p>
                Customer reviews submitted from the website will
                appear here.
              </p>
            </div>
          ) : (
            <div className={styles.reviewList}>
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className={styles.reviewCard}
                >
                  <div className={styles.reviewTop}>
                    <div className={styles.customerInfo}>
                      <div className={styles.avatar}>
                        {review.customer_name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <h3>{review.customer_name}</h3>
                        <span>
                          Submitted {formatDate(review.created_at)}
                        </span>
                      </div>
                    </div>

                    <div
                      className={
                        review.approved
                          ? styles.approvedStatus
                          : styles.pendingStatus
                      }
                    >
                      {review.approved ? "✓ Approved" : "● Pending"}
                    </div>
                  </div>

                  <div className={styles.rating}>
                    {renderStars(review.rating)}
                    <span>{review.rating}/5</span>
                  </div>

                  <p className={styles.reviewText}>
                    “{review.review}”
                  </p>

                  <div className={styles.actions}>
                    <button
                      className={
                        review.approved
                          ? styles.unapproveButton
                          : styles.approveButton
                      }
                      disabled={actionId === review.id}
                      onClick={() => toggleApproval(review)}
                    >
                      {actionId === review.id
                        ? "Processing..."
                        : review.approved
                        ? "Unapprove"
                        : "✓ Approve Review"}
                    </button>

                    <button
                      className={styles.deleteButton}
                      disabled={actionId === review.id}
                      onClick={() => deleteReview(review)}
                    >
                      🗑 Delete
                    </button>
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
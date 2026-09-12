"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./CustomerReviews.module.css";

type Review = {
  id: string;
  customer_name: string;
  rating: number;
  review: string;
  created_at: string;
};

export default function CustomerReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    setLoading(true);

    const { data, error } = await supabase
      .from("reviews")
      .select("id, customer_name, rating, review, created_at")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(6);

    if (!error && data) {
      setReviews(data);
    }

    setLoading(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");

    if (!name.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    if (!review.trim()) {
      setMessage("Please write your review.");
      return;
    }

    if (rating < 1 || rating > 5) {
      setMessage("Please select a rating.");
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from("reviews").insert({
      customer_name: name.trim(),
      rating,
      review: review.trim(),
      approved: false,
    });

    if (error) {
      console.error("Review submission error:", error);
      setMessage("Unable to submit your review. Please try again.");
      setSubmitting(false);
      return;
    }

    setName("");
    setReview("");
    setRating(5);
    setMessage(
      "Thank you! Your review has been submitted and will appear after approval."
    );

    setSubmitting(false);
  }

  function renderStars(value: number) {
    return (
      <div className={styles.stars} aria-label={`${value} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= value ? styles.starActive : styles.star}>
            ★
          </span>
        ))}
      </div>
    );
  }

  return (
    <section className={styles.reviewsSection}>
      <div className={styles.container}>

        {/* HEADER */}
        <div className={styles.header}>
          <div>
            <p className={styles.label}>CUSTOMER EXPERIENCE</p>

            <h2>
              What Our Customers
              <br />
              <span>Say About Us.</span>
            </h2>
          </div>

          <p className={styles.headerText}>
            Your experience matters to us. Share your experience with
            Ultimate Realty UR and help future customers make confident
            property decisions.
          </p>
        </div>

        {/* REVIEW CONTENT */}
        <div className={styles.reviewLayout}>

          {/* EXISTING REVIEWS */}
          <div className={styles.reviewList}>
            {loading ? (
              <div className={styles.emptyState}>
                Loading customer reviews...
              </div>
            ) : reviews.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyStars}>★★★★★</span>

                <h3>Be Our First Reviewer</h3>

                <p>
                  Share your experience with Ultimate Realty UR.
                </p>
              </div>
            ) : (
              reviews.map((item) => (
                <article
                  key={item.id}
                  className={styles.reviewCard}
                >
                  <div className={styles.reviewTop}>
                    {renderStars(item.rating)}

                    <span className={styles.reviewDate}>
                      {new Date(item.created_at).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>

                  <p className={styles.reviewText}>
                    “{item.review}”
                  </p>

                  <div className={styles.customerName}>
                    <span>
                      {item.customer_name.charAt(0).toUpperCase()}
                    </span>

                    <strong>{item.customer_name}</strong>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* REVIEW FORM */}
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <span className={styles.formNumber}>01</span>

              <div>
                <h3>Rate Your Experience</h3>

                <p>
                  Tell us how we did.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>

              {/* RATING */}
              <div className={styles.formGroup}>
                <label>Your Rating</label>

                <div className={styles.ratingSelector}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={
                        star <= rating
                          ? styles.ratingStarActive
                          : styles.ratingStar
                      }
                      onClick={() => setRating(star)}
                      aria-label={`Give ${star} star${
                        star > 1 ? "s" : ""
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <span className={styles.ratingText}>
                  {rating} out of 5
                </span>
              </div>

              {/* NAME */}
              <div className={styles.formGroup}>
                <label htmlFor="customer-name">
                  Your Name
                </label>

                <input
                  id="customer-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Enter your name"
                  maxLength={80}
                />
              </div>

              {/* REVIEW */}
              <div className={styles.formGroup}>
                <label htmlFor="customer-review">
                  Your Review
                </label>

                <textarea
                  id="customer-review"
                  value={review}
                  onChange={(event) =>
                    setReview(event.target.value)
                  }
                  placeholder="Share your experience with Ultimate Realty UR..."
                  rows={5}
                  maxLength={500}
                />
              </div>

              {message && (
                <div className={styles.formMessage}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                className={styles.submitButton}
                disabled={submitting}
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Your Review →"}
              </button>

              <p className={styles.formNote}>
                Reviews are checked before appearing publicly.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
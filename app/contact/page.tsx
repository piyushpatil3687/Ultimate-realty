"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import styles from "./page.module.css";

const PHONE = "9067513120";
const EMAIL = "ultimaterealty711@gmail.com";
const WHATSAPP_MESSAGE =
  "Hello Ultimate Realty UR, I am interested in your properties.";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    requirement: "",
    propertyType: "",
    preferredLocation: "",
    budget: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const whatsappUrl = `https://wa.me/91${PHONE}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE
  )}`;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitting(true);
    setSuccess("");
    setError("");

    try {
      const { error: insertError } = await supabase
        .from("enquiries")
        .insert([
          {
            name: formData.name,
            phone: formData.phone,
            email: formData.email || null,
            requirement: formData.requirement || null,
            property_type: formData.propertyType || null,
            preferred_location: formData.preferredLocation || null,
            budget: formData.budget || null,
          },
        ]);

      if (insertError) {
        throw insertError;
      }

      setSuccess(
        "Thank you! Your enquiry has been submitted successfully. Our team will contact you soon."
      );

      setFormData({
        name: "",
        phone: "",
        email: "",
        requirement: "",
        propertyType: "",
        preferredLocation: "",
        budget: "",
      });
    } catch (err) {
      console.error("Enquiry submission error:", err);
      setError(
        "Something went wrong while submitting your enquiry. Please try again or contact us directly."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      {/* TOP BAR */}
      <div className={styles.topBar}>
        <div className={styles.container}>
          <div className={styles.topBarLeft}>
            <a href={`tel:${PHONE}`}>+91 {PHONE}</a>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </div>

          <div className={styles.topBarRight}>
            <span>Premium Real Estate Services in Pune</span>
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
            <Link href="/properties">Properties</Link>
            <Link href="/about">About Us</Link>
            <Link href="/services">Services</Link>
            <Link href="/contact" className={styles.active}>
              Contact Us
            </Link>
          </nav>

          <a href={`tel:${PHONE}`} className={styles.headerButton}>
            Contact Us
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>

        <div className={styles.container}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>GET IN TOUCH</p>

            <h1>Let&apos;s Find Your<br />Perfect Property</h1>

            <p>
              Whether you are looking to buy, rent, or invest, our team is
              ready to help you find the right property in Pune.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT INTRO */}
      <section className={styles.introSection}>
        <div className={styles.container}>
          <div className={styles.introGrid}>
            <div>
              <p className={styles.sectionEyebrow}>CONTACT ULTIMATE REALTY UR</p>

              <h2>We&apos;re Here to Help</h2>

              <p className={styles.introText}>
                Have a property requirement or need assistance with your
                property search? Get in touch with Ultimate Realty UR and our
                team will help you with suitable options.
              </p>

              <p className={styles.introText}>
                We work with home buyers, tenants, investors, and property
                owners across Pune.
              </p>
            </div>

            <div className={styles.contactInfo}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>LOCATION</span>
                <h3>Ravet, Pune, Maharashtra</h3>
                <p>Serving property requirements across Pune.</p>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>PHONE</span>
                <a href={`tel:${PHONE}`} className={styles.infoLink}>
                  +91 {PHONE}
                </a>
                <p>Call us for property assistance.</p>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>EMAIL</span>
                <a href={`mailto:${EMAIL}`} className={styles.infoLink}>
                  {EMAIL}
                </a>
                <p>Send us your property requirement.</p>
              </div>

              <div className={styles.contactActions}>
                <a href={`tel:${PHONE}`} className={styles.darkButton}>
                  Call Us
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsappButton}
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ENQUIRY FORM */}
      <section className={styles.formSection}>
        <div className={styles.container}>
          <div className={styles.formHeader}>
            <div>
              <p className={styles.sectionEyebrow}>PROPERTY ENQUIRY</p>

              <h2>Tell Us What You&apos;re Looking For</h2>
            </div>

            <p>
              Share your requirements and our team will get back to you with
              suitable property options.
            </p>
          </div>

          <div className={styles.formCard}>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                {/* NAME */}
                <div className={styles.field}>
                  <label htmlFor="name">Full Name *</label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* PHONE */}
                <div className={styles.field}>
                  <label htmlFor="phone">Phone Number *</label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* EMAIL */}
                <div className={styles.field}>
                  <label htmlFor="email">Email Address</label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                {/* PROPERTY TYPE */}
                <div className={styles.field}>
                  <label htmlFor="propertyType">Property Type</label>

                  <select
                    id="propertyType"
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                  >
                    <option value="">Select property type</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Flat">Flat</option>
                    <option value="Villa">Villa</option>
                    <option value="Plot">Plot</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Office">Office</option>
                    <option value="Shop">Shop</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* LOCATION */}
                <div className={styles.field}>
                  <label htmlFor="preferredLocation">
                    Preferred Location
                  </label>

                  <input
                    id="preferredLocation"
                    name="preferredLocation"
                    type="text"
                    placeholder="e.g. Ravet, Wakad, Hinjewadi"
                    value={formData.preferredLocation}
                    onChange={handleChange}
                  />
                </div>

                {/* BUDGET */}
                <div className={styles.field}>
                  <label htmlFor="budget">Budget</label>

                  <input
                    id="budget"
                    name="budget"
                    type="text"
                    placeholder="e.g. ₹50 Lakh - ₹80 Lakh"
                    value={formData.budget}
                    onChange={handleChange}
                  />
                </div>

                {/* REQUIREMENT */}
                <div className={`${styles.field} ${styles.fullWidth}`}>
                  <label htmlFor="requirement">
                    Your Requirement
                  </label>

                  <textarea
                    id="requirement"
                    name="requirement"
                    rows={6}
                    placeholder="Tell us more about what you are looking for..."
                    value={formData.requirement}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              {/* SUCCESS */}
              {success && (
                <div className={styles.successMessage}>
                  {success}
                </div>
              )}

              {/* ERROR */}
              {error && (
                <div className={styles.errorMessage}>
                  {error}
                </div>
              )}

              <div className={styles.formBottom}>
                <p>
                  By submitting this form, you agree to be contacted by
                  Ultimate Realty UR regarding your enquiry.
                </p>

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Enquiry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* DIRECT CONTACT */}
      <section className={styles.directSection}>
        <div className={styles.container}>
          <div className={styles.directGrid}>
            <div>
              <p className={styles.sectionEyebrow}>NEED QUICK ASSISTANCE?</p>

              <h2>Talk to Our Property Team</h2>

              <p>
                For immediate assistance, contact us directly by phone or
                WhatsApp. Our team will help you with available properties and
                your specific requirements.
              </p>
            </div>

            <div className={styles.directActions}>
              <a href={`tel:${PHONE}`} className={styles.darkButton}>
                +91 {PHONE}
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappButton}
              >
                Chat on WhatsApp
              </a>

              <a href={`mailto:${EMAIL}`} className={styles.outlineButton}>
                Send Email
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaInner}>
            <div>
              <p className={styles.sectionEyebrow}>YOUR NEXT PROPERTY</p>

              <h2>Ready to Find Your Dream Home?</h2>

              <p>
                Explore our property collection or speak with our team to
                discover the right opportunity for you.
              </p>
            </div>

            <div className={styles.ctaActions}>
              <Link href="/properties" className={styles.lightButton}>
                Explore Properties
              </Link>

              <a href={`tel:${PHONE}`} className={styles.ctaPhone}>
                Call +91 {PHONE}
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
                <span className={styles.logoMain}>ULTIMATE</span>
                <span className={styles.logoSub}>REALTY UR</span>
              </Link>

              <p>
                Helping home buyers find the right homes and property
                opportunities across Pune.
              </p>

              <span className={styles.footerLocation}>
                Ravet, Pune, Maharashtra
              </span>
            </div>

            <div className={styles.footerColumn}>
              <h4>QUICK LINKS</h4>

              <Link href="/">Home</Link>
              <Link href="/properties">Properties</Link>
              <Link href="/about">About Us</Link>
              <Link href="/services">Services</Link>
              <Link href="/contact">Contact Us</Link>
            </div>

            <div className={styles.footerColumn}>
              <h4>RESOURCES</h4>

              <Link href="/maharera">MahaRERA</Link>
              <Link href="/properties">Buy Property</Link>
              <Link href="/properties">Rent Property</Link>
            </div>

            <div className={styles.footerColumn}>
              <h4>CONTACT</h4>

              <a href={`tel:${PHONE}`}>+91 {PHONE}</a>

              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p>© {new Date().getFullYear()} Ultimate Realty UR. All rights reserved.</p>

            <p>Real Estate Services • Pune</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
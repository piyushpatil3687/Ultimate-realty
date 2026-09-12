"use client";

import Link from "next/link";
import styles from "./page.module.css";

export default function AboutPage() {
  return (
    <main className={styles.page}>
      {/* TOP BAR */}
      <div className={styles.topBar}>
        <div className={styles.container}>
          <div className={styles.topLeft}>
            <span>📍 Ravet, Mukai Chowk, Pune</span>
          </div>

          <div className={styles.topRight}>
            <a href="tel:+919067513120">📞 +91 90675 13120</a>
            <a href="mailto:ultimaterealty711@gmail.com">
              ✉ ultimaterealty711@gmail.com
            </a>
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
            <Link href="/about" className={styles.active}>
              About Us
            </Link>
            <Link href="/services">Services</Link>
            <Link href="/contact">Contact Us</Link>
          </nav>

          <Link href="/properties" className={styles.headerButton}>
            View Properties
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}>
          <div className={styles.container}>
            <div className={styles.heroContent}>
              <span className={styles.eyebrow}>ABOUT ULTIMATE REALTY UR</span>

              <h1>
                Helping You Find a Place
                <br />
                <em>To Call Home.</em>
              </h1>

              <p>
                We make the journey of finding the right property simple,
                transparent and comfortable for every home buyer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className={styles.introSection}>
        <div className={styles.container}>
          <div className={styles.introGrid}>
            <div className={styles.introImage}>
              <div className={styles.imageFrame}>
                <img
                  src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85"
                  alt="Modern luxury home"
                />
              </div>

              <div className={styles.experienceCard}>
                <span>UR</span>
                <p>REAL ESTATE</p>
              </div>
            </div>

            <div className={styles.introContent}>
              <span className={styles.sectionLabel}>WHO WE ARE</span>

              <h2>
                Real Estate
                <br />
                <em>With a Personal Touch.</em>
              </h2>

              <p>
                Ultimate Realty UR is a real estate firm based in Pune,
                focused on helping people discover properties that match
                their lifestyle, requirements and budget.
              </p>

              <p>
                From the first property search to making an informed
                decision, our approach is centered around understanding what
                our clients actually need. We aim to make property
                discovery easier by bringing relevant options together in
                one place.
              </p>

              <p>
                Whether you are looking for an apartment, villa, plot,
                commercial property or a rental property, we are here to
                assist you throughout the journey.
              </p>

              <Link href="/properties" className={styles.textButton}>
                Explore Our Properties <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className={styles.missionSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionLabel}>OUR APPROACH</span>

            <h2>
              Built Around
              <br />
              <em>Your Needs.</em>
            </h2>
          </div>

          <div className={styles.missionGrid}>
            <div className={styles.missionCard}>
              <div className={styles.cardNumber}>01</div>

              <h3>Our Mission</h3>

              <p>
                To make property discovery straightforward by connecting
                buyers and tenants with suitable real estate opportunities
                and providing clear information to support better decisions.
              </p>
            </div>

            <div className={styles.missionCard}>
              <div className={styles.cardNumber}>02</div>

              <h3>Our Vision</h3>

              <p>
                To become a trusted real estate partner for people searching
                for homes and properties in Pune by creating a professional,
                reliable and client-focused property experience.
              </p>
            </div>

            <div className={styles.missionCard}>
              <div className={styles.cardNumber}>03</div>

              <h3>Our Promise</h3>

              <p>
                We focus on understanding your requirements, presenting
                relevant options and supporting you with a smooth and
                transparent property-search experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className={styles.whySection}>
        <div className={styles.container}>
          <div className={styles.whyGrid}>
            <div className={styles.whyContent}>
              <span className={styles.sectionLabel}>WHY ULTIMATE REALTY</span>

              <h2>
                More Than Just
                <br />
                <em>Property Listings.</em>
              </h2>

              <p className={styles.whyIntro}>
                Finding a property is an important decision. Our goal is to
                make that decision easier by focusing on what matters to you.
              </p>

              <div className={styles.points}>
                <div className={styles.point}>
                  <span>01</span>
                  <div>
                    <h3>Client Focused</h3>
                    <p>
                      We begin by understanding your requirements before
                      suggesting property options.
                    </p>
                  </div>
                </div>

                <div className={styles.point}>
                  <span>02</span>
                  <div>
                    <h3>Local Understanding</h3>
                    <p>
                      Our focus on Pune helps us present property options
                      across different locations and requirements.
                    </p>
                  </div>
                </div>

                <div className={styles.point}>
                  <span>03</span>
                  <div>
                    <h3>Multiple Property Options</h3>
                    <p>
                      Explore residential and commercial properties for sale
                      as well as rental opportunities.
                    </p>
                  </div>
                </div>

                <div className={styles.point}>
                  <span>04</span>
                  <div>
                    <h3>Easy Enquiry</h3>
                    <p>
                      Contact us through call, WhatsApp or our enquiry form
                      whenever you find a property you like.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.whyImage}>
              <img
                src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85"
                alt="Elegant modern property interior"
              />
            </div>
          </div>
        </div>
      </section>

      {/* HOME BUYER SECTION */}
      <section className={styles.buyerSection}>
        <div className={styles.buyerOverlay}>
          <div className={styles.container}>
            <div className={styles.buyerContent}>
              <span className={styles.sectionLabel}>FOR HOME BUYERS</span>

              <h2>
                Your Search.
                <br />
                <em>Our Support.</em>
              </h2>

              <p>
                Looking for your next home in Pune? Tell us what you are
                looking for and explore property options that fit your
                requirements.
              </p>

              <div className={styles.buyerButtons}>
                <Link href="/properties" className={styles.primaryButton}>
                  Browse Properties
                </Link>

                <Link href="/contact" className={styles.secondaryButton}>
                  Talk to Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaInner}>
            <div>
              <span className={styles.sectionLabel}>LET'S CONNECT</span>

              <h2>
                Ready to Find
                <br />
                <em>Your Next Property?</em>
              </h2>
            </div>

            <div className={styles.ctaActions}>
              <Link href="/properties" className={styles.ctaPrimary}>
                View Properties
              </Link>

              <a
                href="https://wa.me/919067513120"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaSecondary}
              >
                WhatsApp Us
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
                <span className={styles.logoMain}>ULTIMATE REALTY</span>
                <span className={styles.logoSub}>UR • PUNE</span>
              </Link>

              <p>
                Helping home buyers discover the right property in Pune.
              </p>
            </div>

            <div className={styles.footerColumn}>
              <h4>Explore</h4>
              <Link href="/">Home</Link>
              <Link href="/properties">Properties</Link>
              <Link href="/about">About Us</Link>
              <Link href="/services">Services</Link>
            </div>

            <div className={styles.footerColumn}>
              <h4>Contact</h4>
              <a href="tel:+919067513120">+91 90675 13120</a>
              <a href="mailto:ultimaterealty711@gmail.com">
                ultimaterealty711@gmail.com
              </a>
              <span>Ravet, Mukai Chowk, Pune</span>
            </div>

            <div className={styles.footerColumn}>
              <h4>Quick Links</h4>
              <Link href="/properties">Find a Property</Link>
              <Link href="/contact">Send an Enquiry</Link>
              <Link href="/contact">Contact Us</Link>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <span>© 2026 Ultimate Realty UR. All Rights Reserved.</span>

            <span>Pune, Maharashtra</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
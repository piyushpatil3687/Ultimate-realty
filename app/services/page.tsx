"use client";

import Link from "next/link";
import styles from "./page.module.css";

export default function ServicesPage() {
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
            <Link href="/about">About Us</Link>
            <Link href="/services" className={styles.active}>
              Services
            </Link>
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
              <span className={styles.eyebrow}>OUR SERVICES</span>

              <h1>
                Real Estate
                <br />
                <em>Made Simpler.</em>
              </h1>

              <p>
                From finding the right property to making your next move, we
                provide practical real estate assistance designed around your
                requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className={styles.introSection}>
        <div className={styles.container}>
          <div className={styles.introGrid}>
            <div>
              <span className={styles.sectionLabel}>WHAT WE DO</span>

              <h2>
                Property Solutions
                <br />
                <em>For Every Requirement.</em>
              </h2>
            </div>

            <div className={styles.introText}>
              <p>
                At Ultimate Realty UR, we help clients explore residential
                and commercial property opportunities in Pune.
              </p>

              <p>
                Whether you are buying your first home, looking for an
                investment property, searching for a rental or exploring a
                commercial space, our services are designed to make your
                property search more convenient.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className={styles.servicesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>OUR SERVICES</span>

            <h2>
              How We Can
              <br />
              <em>Help You.</em>
            </h2>
          </div>

          <div className={styles.servicesGrid}>
            {/* SERVICE 01 */}
            <article className={styles.serviceCard}>
              <div className={styles.serviceTop}>
                <span className={styles.serviceNumber}>01</span>
                <span className={styles.serviceIcon}>⌂</span>
              </div>

              <h3>Property Buying</h3>

              <p>
                Looking for a new home or investment property? We help you
                explore suitable properties based on your location, budget,
                property type and requirements.
              </p>

              <Link href="/properties" className={styles.serviceLink}>
                Explore Properties <span>→</span>
              </Link>
            </article>

            {/* SERVICE 02 */}
            <article className={styles.serviceCard}>
              <div className={styles.serviceTop}>
                <span className={styles.serviceNumber}>02</span>
                <span className={styles.serviceIcon}>▣</span>
              </div>

              <h3>Property Selling</h3>

              <p>
                If you are planning to sell a property, we help present the
                property to potential buyers and support the enquiry process.
              </p>

              <Link href="/contact" className={styles.serviceLink}>
                Discuss Your Property <span>→</span>
              </Link>
            </article>

            {/* SERVICE 03 */}
            <article className={styles.serviceCard}>
              <div className={styles.serviceTop}>
                <span className={styles.serviceNumber}>03</span>
                <span className={styles.serviceIcon}>⌂</span>
              </div>

              <h3>Rental Properties</h3>

              <p>
                Find rental opportunities that match your preferred location,
                property type and requirements, whether for residential or
                other suitable spaces.
              </p>

              <Link href="/properties?listing=rent" className={styles.serviceLink}>
                Find Rental Properties <span>→</span>
              </Link>
            </article>

            {/* SERVICE 04 */}
            <article className={styles.serviceCard}>
              <div className={styles.serviceTop}>
                <span className={styles.serviceNumber}>04</span>
                <span className={styles.serviceIcon}>◆</span>
              </div>

              <h3>Residential Properties</h3>

              <p>
                Explore apartments, flats, villas and other residential
                properties for different lifestyles, budgets and family
                requirements.
              </p>

              <Link href="/properties" className={styles.serviceLink}>
                View Residential Options <span>→</span>
              </Link>
            </article>

            {/* SERVICE 05 */}
            <article className={styles.serviceCard}>
              <div className={styles.serviceTop}>
                <span className={styles.serviceNumber}>05</span>
                <span className={styles.serviceIcon}>▤</span>
              </div>

              <h3>Commercial Properties</h3>

              <p>
                Discover commercial opportunities such as offices, shops and
                other spaces suitable for business and professional needs.
              </p>

              <Link href="/properties" className={styles.serviceLink}>
                View Commercial Options <span>→</span>
              </Link>
            </article>

            {/* SERVICE 06 */}
            <article className={styles.serviceCard}>
              <div className={styles.serviceTop}>
                <span className={styles.serviceNumber}>06</span>
                <span className={styles.serviceIcon}>◈</span>
              </div>

              <h3>Property Assistance</h3>

              <p>
                Have questions about a property? Contact us through call,
                WhatsApp or enquiry form and our team can help you with the
                next steps.
              </p>

              <Link href="/contact" className={styles.serviceLink}>
                Talk to Us <span>→</span>
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className={styles.processSection}>
        <div className={styles.container}>
          <div className={styles.processHeading}>
            <span className={styles.sectionLabel}>OUR PROCESS</span>

            <h2>
              A Straightforward
              <br />
              <em>Property Journey.</em>
            </h2>

            <p>
              We keep the process simple so you can focus on finding a
              property that feels right for you.
            </p>
          </div>

          <div className={styles.processGrid}>
            <div className={styles.processItem}>
              <span>01</span>
              <h3>Tell Us Your Requirement</h3>
              <p>
                Share your preferred location, budget, property type and
                other important requirements.
              </p>
            </div>

            <div className={styles.processItem}>
              <span>02</span>
              <h3>Explore Suitable Options</h3>
              <p>
                Browse available properties and shortlist the options that
                best match your requirements.
              </p>
            </div>

            <div className={styles.processItem}>
              <span>03</span>
              <h3>Connect With Us</h3>
              <p>
                Contact us by phone, WhatsApp or enquiry form for more
                information about a property.
              </p>
            </div>

            <div className={styles.processItem}>
              <span>04</span>
              <h3>Move Forward</h3>
              <p>
                Once you find the right opportunity, we help make the next
                stage of your property journey easier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROPERTY TYPES */}
      <section className={styles.typesSection}>
        <div className={styles.container}>
          <div className={styles.typesGrid}>
            <div className={styles.typesImage}>
              <img
                src="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=85"
                alt="Modern property interior"
              />
            </div>

            <div className={styles.typesContent}>
              <span className={styles.sectionLabel}>PROPERTY OPTIONS</span>

              <h2>
                Find What
                <br />
                <em>Fits Your Life.</em>
              </h2>

              <p>
                Our property listings cover different types of real estate,
                making it easier to search according to your requirements.
              </p>

              <div className={styles.typeList}>
                <div>
                  <span>01</span>
                  <strong>Flats & Apartments</strong>
                </div>

                <div>
                  <span>02</span>
                  <strong>Villas & Homes</strong>
                </div>

                <div>
                  <span>03</span>
                  <strong>Plots</strong>
                </div>

                <div>
                  <span>04</span>
                  <strong>Commercial Spaces</strong>
                </div>

                <div>
                  <span>05</span>
                  <strong>Office & Shops</strong>
                </div>

                <div>
                  <span>06</span>
                  <strong>Rental Properties</strong>
                </div>
              </div>

              <Link href="/properties" className={styles.darkButton}>
                Browse All Properties
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaInner}>
            <div>
              <span className={styles.sectionLabel}>START YOUR SEARCH</span>

              <h2>
                Looking for a
                <br />
                <em>Property in Pune?</em>
              </h2>

              <p>
                Tell us what you are looking for and let us help you explore
                suitable property options.
              </p>
            </div>

            <div className={styles.ctaActions}>
              <Link href="/properties" className={styles.ctaPrimary}>
                View Properties
              </Link>

              <Link href="/contact" className={styles.ctaSecondary}>
                Send an Enquiry
              </Link>
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
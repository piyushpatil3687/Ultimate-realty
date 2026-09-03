"use client";

import Link from "next/link";
import styles from "./page.module.css";

export default function MahaReraPage() {
  return (
    <main className={styles.page}>
      {/* TOP BAR */}
      <div className={styles.topBar}>
        <div className={styles.container}>
          <div>📍 Ravet, Mukai Chowk, Pune</div>

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
            <span className={styles.logoMain}>ULTIMATE REALTY</span>
            <span className={styles.logoSub}>UR • PUNE</span>
          </Link>

          <nav className={styles.nav}>
            <Link href="/">Home</Link>
            <Link href="/properties">Properties</Link>
            <Link href="/about">About Us</Link>
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
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>REAL ESTATE INFORMATION</span>

            <h1>
              MahaRERA
              <br />
              <em>Information.</em>
            </h1>

            <p>
              Understanding MahaRERA can help home buyers make more informed
              decisions when exploring registered real estate projects in
              Maharashtra.
            </p>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className={styles.introSection}>
        <div className={styles.container}>
          <div className={styles.introGrid}>
            <div>
              <span className={styles.sectionLabel}>ABOUT MAHARERA</span>

              <h2>
                Greater
                <br />
                <em>Transparency.</em>
              </h2>
            </div>

            <div className={styles.introText}>
              <p>
                MahaRERA refers to the Maharashtra Real Estate Regulatory
                Authority, established under the Real Estate (Regulation and
                Development) Act, 2016.
              </p>

              <p>
                The regulatory framework is intended to promote transparency,
                accountability and information access in the real estate
                sector.
              </p>

              <p>
                Buyers should independently verify the registration and
                project information available through the official MahaRERA
                platform before making important property decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IS MAHARERA */}
      <section className={styles.infoSection}>
        <div className={styles.container}>
          <div className={styles.infoHeader}>
            <span className={styles.sectionLabel}>01 — OVERVIEW</span>

            <h2>
              What is
              <br />
              <em>MahaRERA?</em>
            </h2>
          </div>

          <div className={styles.infoContent}>
            <p>
              The Maharashtra Real Estate Regulatory Authority, commonly
              known as MahaRERA, is the regulatory authority for real estate
              projects and real estate agents covered by the applicable
              provisions of RERA in Maharashtra.
            </p>

            <p>
              It provides a framework intended to improve transparency between
              real estate developers, agents and home buyers.
            </p>

            <p>
              Project information, where applicable, can be checked through
              the official MahaRERA website.
            </p>
          </div>
        </div>
      </section>

      {/* BUYER CHECKLIST */}
      <section className={styles.checklistSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>
              02 — HOME BUYER CHECKLIST
            </span>

            <h2>
              Before You
              <br />
              <em>Buy.</em>
            </h2>

            <p>
              When considering a real estate project, buyers should take time
              to review important project and transaction information.
            </p>
          </div>

          <div className={styles.checklistGrid}>
            <div className={styles.checkCard}>
              <span>01</span>
              <div>
                <h3>Check Project Registration</h3>
                <p>
                  Verify the project's MahaRERA registration details through
                  the official authority website where applicable.
                </p>
              </div>
            </div>

            <div className={styles.checkCard}>
              <span>02</span>
              <div>
                <h3>Review Project Details</h3>
                <p>
                  Review available information about the project, developer,
                  location, approvals and other relevant details.
                </p>
              </div>
            </div>

            <div className={styles.checkCard}>
              <span>03</span>
              <div>
                <h3>Understand the Agreement</h3>
                <p>
                  Carefully read the agreement and understand the commercial
                  and legal terms before signing.
                </p>
              </div>
            </div>

            <div className={styles.checkCard}>
              <span>04</span>
              <div>
                <h3>Verify Property Documents</h3>
                <p>
                  Review relevant property documents and seek qualified
                  professional advice when necessary.
                </p>
              </div>
            </div>

            <div className={styles.checkCard}>
              <span>05</span>
              <div>
                <h3>Understand Costs</h3>
                <p>
                  Ask about the property price, applicable charges, taxes,
                  registration costs and other financial obligations.
                </p>
              </div>
            </div>

            <div className={styles.checkCard}>
              <span>06</span>
              <div>
                <h3>Ask Questions</h3>
                <p>
                  Get clarification about possession, amenities, timelines,
                  specifications and other important aspects of the property.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IMPORTANT NOTE */}
      <section className={styles.noteSection}>
        <div className={styles.container}>
          <div className={styles.noteBox}>
            <div className={styles.noteIcon}>i</div>

            <div>
              <span className={styles.sectionLabel}>IMPORTANT</span>

              <h2>Verify Information Independently</h2>

              <p>
                Information on this page is provided for general awareness
                only. Buyers should verify current registration details,
                project information, approvals, agreements and other
                applicable requirements directly through official sources and
                qualified professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OFFICIAL LINK */}
      <section className={styles.officialSection}>
        <div className={styles.container}>
          <div className={styles.officialInner}>
            <div>
              <span className={styles.sectionLabel}>OFFICIAL RESOURCE</span>

              <h2>
                Check MahaRERA
                <br />
                <em>Project Information.</em>
              </h2>

              <p>
                Visit the official MahaRERA website to search for project and
                registration information.
              </p>
            </div>

            <a
              href="https://maharera.maharashtra.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.officialButton}
            >
              Visit Official MahaRERA ↗
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaInner}>
            <div>
              <span className={styles.sectionLabel}>NEED HELP?</span>

              <h2>
                Looking for a
                <br />
                <em>Property in Pune?</em>
              </h2>

              <p>
                Explore our available properties or contact Ultimate Realty
                UR to discuss your property requirement.
              </p>
            </div>

            <div className={styles.ctaActions}>
              <Link href="/properties" className={styles.primaryButton}>
                View Properties
              </Link>

              <Link href="/contact" className={styles.secondaryButton}>
                Contact Us
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
              <h4>Information</h4>
              <Link href="/maharera">MahaRERA</Link>
              <Link href="/properties">Property Listings</Link>
              <Link href="/contact">Enquiry</Link>
            </div>

            <div className={styles.footerColumn}>
              <h4>Contact</h4>
              <a href="tel:+919067513120">+91 90675 13120</a>
              <a href="mailto:ultimaterealty711@gmail.com">
                ultimaterealty711@gmail.com
              </a>
              <span>Ravet, Mukai Chowk, Pune</span>
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
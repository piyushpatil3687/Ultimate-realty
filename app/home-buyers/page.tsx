export default function HomeBuyersPage() {
  const steps = [
    {
      number: "01",
      title: "Understand Your Requirement",
      description:
        "Start by identifying your preferred location, property type, budget, size and other requirements.",
    },
    {
      number: "02",
      title: "Set Your Budget",
      description:
        "Consider the property price along with other costs involved in purchasing and owning a property.",
    },
    {
      number: "03",
      title: "Explore Properties",
      description:
        "Browse available properties and compare location, area, configuration, amenities and other details.",
    },
    {
      number: "04",
      title: "Shortlist Properties",
      description:
        "Shortlist properties that match your requirements and arrange property visits where appropriate.",
    },
    {
      number: "05",
      title: "Verify Property Information",
      description:
        "Review the documents and property information carefully and seek appropriate professional advice when required.",
    },
    {
      number: "06",
      title: "Make Your Decision",
      description:
        "After reviewing the available information, proceed with the property that best suits your requirements.",
    },
  ];

  const checklist = [
    "Location and connectivity",
    "Property type and configuration",
    "Carpet / built-up area",
    "Property price and budget",
    "Amenities and facilities",
    "Parking availability",
    "Possession information",
    "Property documentation",
    "Applicable approvals and registrations",
    "Maintenance and other applicable charges",
  ];

  return (
    <main>
      {/* Header */}

      <header className="simple-header">
        <div className="container simple-header-inner">
          <a href="/" className="simple-logo">
            <span>UR</span>

            <div>
              <strong>ULTIMATE</strong>
              <small>REALTY</small>
            </div>
          </a>

          <nav>
            <a href="/">Home</a>
            <a href="/properties">Properties</a>
            <a href="/services">Services</a>
            <a href="/about">About</a>
            <a href="/home-buyers">Home Buyers</a>
            <a href="/maharera">MahaRERA</a>
            <a href="/contact">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}

      <section className="inner-page-hero home-buyers-hero">
        <div className="container">
          <p>HOME BUYER GUIDE</p>

          <h1>
            Find a home
            <br />
            with confidence.
          </h1>

          <span>
            A simple guide to help you understand the home buying
            journey.
          </span>
        </div>
      </section>

      {/* Introduction */}

      <section className="home-buyer-intro">
        <div className="container home-buyer-intro-grid">
          <div>
            <p className="section-label">
              BEFORE YOU BUY
            </p>

            <h2>
              Take the time to
              <br />
              make an informed choice.
            </h2>
          </div>

          <div>
            <p>
              Buying a home is an important decision. The right property
              depends on your budget, location preference, lifestyle and
              long-term requirements.
            </p>

            <p>
              Before making a decision, compare available properties,
              review the information provided and understand the costs
              and documentation involved.
            </p>

            <p>
              Ultimate Realty UR can help you explore property options
              and connect with suitable properties in Pune.
            </p>
          </div>
        </div>
      </section>

      {/* Buying Process */}

      <section className="home-buying-process">
        <div className="container">
          <div className="home-section-heading">
            <p className="section-label">
              THE HOME BUYING JOURNEY
            </p>

            <h2>
              Six steps to
              <br />
              get started.
            </h2>
          </div>

          <div className="home-steps-grid">
            {steps.map((step) => (
              <article key={step.number}>
                <span>{step.number}</span>

                <h3>{step.title}</h3>

                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Checklist */}

      <section className="home-checklist-section">
        <div className="container home-checklist-grid">
          <div>
            <p className="section-label">
              PROPERTY CHECKLIST
            </p>

            <h2>
              Things to
              <br />
              consider.
            </h2>

            <p className="checklist-intro">
              Use this checklist when comparing properties. The exact
              requirements may vary depending on the property and
              transaction.
            </p>
          </div>

          <div className="buyer-checklist">
            {checklist.map((item, index) => (
              <div key={item}>
                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents */}

      <section className="documents-section">
        <div className="container">
          <div className="home-section-heading">
            <p className="section-label">
              DOCUMENTATION
            </p>

            <h2>
              Review important
              <br />
              property information.
            </h2>
          </div>

          <div className="document-cards">
            <div>
              <span>01</span>

              <h3>Property Documents</h3>

              <p>
                Review the relevant property and ownership documents
                applicable to the transaction.
              </p>
            </div>

            <div>
              <span>02</span>

              <h3>Approvals & Registrations</h3>

              <p>
                Check applicable approvals, registrations and other
                regulatory information for the property.
              </p>
            </div>

            <div>
              <span>03</span>

              <h3>Agreement & Charges</h3>

              <p>
                Understand the agreement terms and applicable costs,
                charges and payment requirements before proceeding.
              </p>
            </div>
          </div>

          <div className="buyer-note">
            <strong>Important:</strong>

            <span>
              Property documentation and legal requirements can vary.
              Buyers should verify documents independently and consult
              qualified legal or financial professionals where
              appropriate.
            </span>
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="property-contact">
        <div className="container">
          <p className="section-label">
            READY TO START?
          </p>

          <h2>
            Tell us what kind of home you're looking for.
          </h2>

          <p>
            Explore properties available through Ultimate Realty UR
            or contact our team with your requirements.
          </p>

          <div>
            <a href="/properties">
              Explore Properties
            </a>

            <a href="/contact">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
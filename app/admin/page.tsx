"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [propertyCount, setPropertyCount] = useState(0);
  const [enquiryCount, setEnquiryCount] = useState(0);
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

    setPropertyCount(properties || 0);
    setEnquiryCount(enquiries || 0);
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();

    router.replace("/admin/login");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="admin-loading">
        <p>Loading Ultimate Realty Admin...</p>
      </main>
    );
  }

  return (
    <main className="admin-dashboard">

      {/* Sidebar */}

      <aside className="admin-sidebar">

        <div className="admin-brand">
          <span>UR</span>

          <div>
            <strong>ULTIMATE</strong>
            <small>REALTY</small>
          </div>
        </div>

        <div className="admin-sidebar-label">
          ADMIN PANEL
        </div>

        <nav className="admin-navigation">

          <a
            href="/admin"
            className="active"
          >
            Dashboard
          </a>

          <a href="/admin/properties">
            Properties
          </a>

          <a href="/admin/enquiries">
            Enquiries
          </a>

        </nav>

        <div className="admin-sidebar-bottom">

          <a
            href="/"
            target="_blank"
          >
            View Website ↗
          </a>

          <button onClick={handleLogout}>
            Logout
          </button>

        </div>

      </aside>

      {/* Main Dashboard */}

      <section className="admin-content">

        <header className="admin-topbar">

          <div>
            <p>ADMINISTRATION</p>

            <h1>
              Dashboard
            </h1>
          </div>

          <div className="admin-user">
            <span>Logged in as</span>
            <strong>{email}</strong>
          </div>

        </header>

        {/* Stats */}

        <section className="admin-stats">

          <div className="admin-stat-card">

            <span>
              PROPERTIES
            </span>

            <strong>
              {propertyCount}
            </strong>

            <p>
              Total listed properties
            </p>

          </div>

          <div className="admin-stat-card">

            <span>
              ENQUIRIES
            </span>

            <strong>
              {enquiryCount}
            </strong>

            <p>
              Customer enquiries
            </p>

          </div>

          <div className="admin-stat-card">

            <span>
              STATUS
            </span>

            <strong>
              Active
            </strong>

            <p>
              Website administration
            </p>

          </div>

        </section>

        {/* Quick Actions */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <div>
              <p>
                QUICK ACTIONS
              </p>

              <h2>
                Manage Ultimate Realty
              </h2>
            </div>

          </div>

          <div className="admin-actions">

            <a
              href="/admin/properties/new"
              className="admin-action-card"
            >

              <span>
                +
              </span>

              <div>
                <h3>
                  Add Property
                </h3>

                <p>
                  Add a new property listing.
                </p>
              </div>

            </a>

            <a
              href="/admin/properties"
              className="admin-action-card"
            >

              <span>
                →
              </span>

              <div>
                <h3>
                  Manage Properties
                </h3>

                <p>
                  Edit and manage existing listings.
                </p>
              </div>

            </a>

            <a
              href="/admin/enquiries"
              className="admin-action-card"
            >

              <span>
                ≡
              </span>

              <div>
                <h3>
                  View Enquiries
                </h3>

                <p>
                  Review customer enquiries.
                </p>
              </div>

            </a>

          </div>

        </section>

        {/* Information */}

        <section className="admin-info">

          <div>

            <p>
              ULTIMATE REALTY UR
            </p>

            <h2>
              Property management
              <br />
              made simple.
            </h2>

          </div>

          <div>

            <p>
              Use the admin panel to manage property listings,
              update property information and review customer
              enquiries from one place.
            </p>

          </div>

        </section>

      </section>

    </main>
  );
}
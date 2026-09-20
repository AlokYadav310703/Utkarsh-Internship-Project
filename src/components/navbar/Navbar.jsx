import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/logo.jpeg";

const nav = [
  { label: "About", to: "/#about" },
  { label: "Eligibility", to: "/#eligibility" },
  { label: "How To Apply", to: "/#how-to-apply" },
  { label: "Results", to: "/#results" },
  { label: "FAQ", to: "/#faq" },
  { label: "Contact", to: "/#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const isActive = (to) => {
    if (to === "/") return pathname === "/";
    return pathname.startsWith(to.split("#")[0]) && to.split("#")[0] !== "/";
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="nav-topbar">
        ADERF Annual Scholarship 2026 — Applications Now Open · 15 June Deadline
      </div>

      <nav className="nav-root">
        <div className="nav-inner">

          {/* Logo */}
          <Link to="/" className="nav-logo">
            <img
              src={logo}
              alt="Utkarsh Scholarship"
              className="nav-logo-img"
            />

            <div>
              <span className="nav-logo-hi">उत्कर्ष</span>
              <span className="nav-logo-en">ADERF SCHOLARSHIP</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <ul className="nav-links">
            {nav.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className={isActive(link.to) ? "active" : ""}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            <li>
              <Link to="/apply" className="nav-cta">
                Apply Now
              </Link>
            </li>
          </ul>

          {/* Hamburger Menu */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span className={menuOpen ? "open-top" : ""} />
            <span className={menuOpen ? "open-mid" : ""} />
            <span className={menuOpen ? "open-bot" : ""} />
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`nav-mobile ${menuOpen ? "open" : ""}`}>
          {nav.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <Link
            to="/apply"
            className="nav-mob-cta"
            onClick={() => setMenuOpen(false)}
          >
            Apply Now
          </Link>
        </div>
      </nav>
    </>
  );
}

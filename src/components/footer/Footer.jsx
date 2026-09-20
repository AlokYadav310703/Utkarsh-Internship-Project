import "./Footer.css";
import logo from "../../assets/logo.jpeg";

const QUICK_LINKS = [
  "Home",
  "About",
  "Eligibility",
  "How to Apply",
  "Results",
  "FAQ",
  "Contact",
];

const PROGRAM_LINKS = [
  "Scholarship Details",
  "Selection Criteria",
  "Merit Screening",
  "Award Disbursement",
  "Scholar Testimonials",
  "Past Scholars",
  "Annual Report",
];

const CONTACT_INFO = [
  {
    icon: "🌐",
    text: "www.aderf.co.in",
    href: "https://www.aderf.co.in",
  },
  {
    icon: "✉️",
    text: "support.utkarsh@aderf.co.in",
    href: "mailto:support.utkarsh@aderf.co.in",
  },
  {
    icon: "📞",
    text: "+91 6205381935 / 9430269924",
    href: "tel:+916205381935",
  },
];

const SOCIAL = [
  { icon: "𝕏", href: "#" },
  { icon: "in", href: "#" },
  { icon: "f", href: "#" },
  { icon: "▶", href: "#" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">

      {/* Main Footer */}
      <div className="footer-main">

        {/* Brand */}
        <div className="footer-brand-col">

          <div className="footer-brand-logo">

            <img
              src={logo}
              alt="Utkarsh Scholarship"
              className="footer-logo-img"
            />

            <div>
              <span className="footer-logo-hi">उत्कर्ष</span>
              <span className="footer-logo-en">
                ADERF Scholarship Program
              </span>
            </div>

          </div>

          <p className="footer-tagline">
            Empowering Young Minds. Inspiring Bright Futures.
            <br />
            A flagship scholarship initiative by the Asian Development
            Educational &amp; Research Foundation (ADERF),
            Patna, Bihar, India.
          </p>

          <div className="footer-contact-list">
            {CONTACT_INFO.map((c) => (
              <a
                key={c.text}
                href={c.href}
                className="footer-contact-item"
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noreferrer" : undefined}
              >
                <span className="footer-contact-icon">{c.icon}</span>
                {c.text}
              </a>
            ))}
          </div>

        </div>

        {/* Quick Links */}
        <div>
          <div className="footer-col-title">Quick Links</div>

          <ul className="footer-nav-list">
            {QUICK_LINKS.map((l) => (
              <li key={l}>
                <a href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}>
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Program Info */}
        <div>
          <div className="footer-col-title">Program Info</div>

          <ul className="footer-nav-list">
            {PROGRAM_LINKS.map((l) => (
              <li key={l}>
                <a href="#">{l}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-newsletter">

          <div className="footer-col-title">
            Stay Updated
          </div>

          <p>
            Get notified when the next scholarship cycle opens.
            One email per year — no spam.
          </p>

          <div className="footer-input-row">

            <input
              className="footer-input"
              type="email"
              placeholder="your@email.com"
            />

            <button className="footer-input-btn">
              Notify
            </button>

          </div>

          <div className="footer-social-row">
            {SOCIAL.map((s, i) => (
              <a
                key={i}
                href={s.href}
                className="footer-social-btn"
              >
                {s.icon}
              </a>
            ))}
          </div>

        </div>

      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">

        <div className="footer-bottom-inner">

          <p className="footer-copy">
            © {currentYear} Asian Development Educational &amp; Research
            Foundation (ADERF) · Patna, Bihar, India · All rights reserved.
            <br />
            ADERF — Empowering Young Minds. Inspiring Bright Futures. ·{" "}
            <a href="#">Privacy Policy</a> ·{" "}
            <a href="#">Terms of Use</a>
          </p>

          <ul className="footer-legal-links">
            <li>
              <a href="#">Privacy Policy</a>
            </li>

            <li>
              <a href="#">Terms of Use</a>
            </li>

            <li>
              <a href="#">Disclaimer</a>
            </li>
          </ul>

        </div>

      </div>

    </footer>
  );
}
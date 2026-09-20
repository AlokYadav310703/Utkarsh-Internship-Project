import { Link } from "react-router-dom";
import "./Home.css";

const FEATURES = [
  {
    icon: "✅",
    title: "Merit-Based & Transparent",
    desc: "Every selection is conducted through a professionally managed, fair evaluation process with academic scoring, document verification, and committee review.",
  },
  {
    icon: "🏫",
    title: "Open to All Recognized Boards",
    desc: "CBSE, ICSE, State Board, and equivalent recognized schools are all eligible. Talent across every region and background is welcome.",
  },
  {
    icon: "💻",
    title: "Fully Digital Process",
    desc: "From application to scholarship disbursement — the entire process is online. Register, upload documents, and track your status from anywhere.",
  },
];

const INFO_CELLS = [
  { label: "Eligible Class",    value: "Class X",  white: false },
  { label: "Program Cycle",     value: "Annual",   white: true  },
  { label: "Award Per Scholar", value: "₹5,000",   white: false },
  { label: "Application Fee",   value: "Zero",     white: true  },
];

const STEPS = [
  { n: "1", title: "Register Online",      desc: "Sign up with mobile OTP verification on the official portal" },
  { n: "2", title: "Submit Application",   desc: "Fill the form and upload your documents securely" },
  { n: "3", title: "Verification",         desc: "School and ADERF verify your documents and enrollment" },
  { n: "4", title: "Get Selected",         desc: "11 scholars selected and awarded ₹5,000 each" },
];

const ELIGIBILITY = [
  { title: "Academic Class",     desc: "Currently enrolled in Class X (10th Standard) during the ongoing academic year" },
  { title: "Recognized School",  desc: "CBSE, ICSE, State Board or any equivalent recognized education board" },
  { title: "Documents Required", desc: "Passport photo, School ID, previous marksheet, and Aadhaar/UID" },
  { title: "Completely Free",    desc: "No application fee, no exam fee. Beware of anyone asking for payment" },
];

const CRITERIA = [
  { label: "Academic Score",         pct: 40 },
  { label: "Financial Need",         pct: 30 },
  { label: "Motivation",             pct: 20 },
  { label: "School Recommendation",  pct: 10 },
  { label: "Area Priority",          pct: 10 },
];

const STATS = [
  { num: "11",    label: "Scholars Selected Yearly" },
  { num: "₹5K",  label: "Scholarship Amount"       },
  { num: "100%", label: "Free to Apply"            },
  { num: "15 Jun", label: "Annual Launch Date"     },
];

export default function HomePage() {
  return (
    <div className="hp">

      {/* ── HERO ──────────────────────────────────────── */}
      <section className="hero" id="home">
        <div className="hero-inner">
          <div>
            <span className="hero-eyebrow">ADERF Annual Scholarship Program</span>
            <h1 className="hero-heading">
              Empowering<br />
              <span className="gold">Future</span><br />
              Achievers
            </h1>
            <p className="hero-body">
              A merit-based scholarship for Class X students — recognizing academic excellence
              and supporting deserving young minds with ₹5,000 financial assistance.
            </p>
            <div className="hero-btns">
              <Link to="/apply" className="btn-primary">Apply Now</Link>
              <a href="#about" className="btn-outline">Learn More</a>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-card-icon">🏅</div>
            <div className="hero-card-label">Merit Scholarship</div>
            <div className="hero-card-amount">₹5,000</div>
            <div className="hero-card-sublabel">One-Time Award</div>
            <div className="hero-card-rows">
              <div className="hero-card-row"><span>Program opens</span>  <span>15 June 2026</span></div>
              <div className="hero-card-row"><span>Class eligible</span> <span>Class X only</span></div>
              <div className="hero-card-row"><span>Seats available</span><span>11</span></div>
              <div className="hero-card-row">
                <span>Application fee</span>
                <span><span className="badge-free">FREE</span></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────── */}
      <div className="stats-bar">
        <div className="stats-bar-inner">
          {STATS.map((s) => (
            <div className="stat-item" key={s.label}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ABOUT ─────────────────────────────────────── */}
      <section className="about-section" id="about">
        <div className="section-inner">
          <div className="section-eyebrow">About the Program</div>
          <h2 className="section-heading">
            A Flagship Initiative by<br />
            <span className="ul-gold">ADERF</span>
          </h2>

          <div className="about-grid">
            <div className="feature-list">
              {FEATURES.map((f) => (
                <div className="feature-item" key={f.title}>
                  <div className="feature-icon">{f.icon}</div>
                  <div>
                    <div className="feature-title">{f.title}</div>
                    <div className="feature-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="info-card">
              <div className="info-card-brand">उत्कर्ष 2026</div>
              <div className="info-card-sub">Asian Dev. Educational &amp; Research Foundation</div>
              <div className="info-grid">
                {INFO_CELLS.map((c) => (
                  <div className="info-cell" key={c.label}>
                    <div className="info-cell-label">{c.label}</div>
                    <div className={`info-cell-value${c.white ? " white" : ""}`}>{c.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────── */}
      <section className="steps-section" id="how-to-apply">
        <div className="section-inner">
          <div className="section-eyebrow">How It Works</div>
          <h2 className="section-heading">Your Journey to Becoming an Utkarsh Scholar</h2>
          <div className="steps-grid">
            {STEPS.map((s) => (
              <div className="step-card" key={s.n}>
                <div className="step-num">{s.n}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ELIGIBILITY ───────────────────────────────── */}
      <section className="elig-section" id="eligibility">
        <div className="section-inner">
          <div className="elig-grid">

            <div>
              <div className="elig-col-head">Who Can Apply</div>
              <div className="elig-col-title">Eligibility at a Glance</div>
              <div className="elig-list">
                {ELIGIBILITY.map((e) => (
                  <div className="elig-item" key={e.title}>
                    <div className="elig-dot" />
                    <div>
                      <div className="elig-item-title">{e.title}</div>
                      <div className="elig-item-desc">{e.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="elig-col-head">Selection Criteria</div>
              <div className="elig-col-title">Merit Screening Engine</div>
              <div className="criteria-list">
                {CRITERIA.map((c) => (
                  <div className="criteria-row" key={c.label}>
                    <div className="criteria-top">
                      <span>{c.label}</span>
                      <span className="criteria-pct">{c.pct}%</span>
                    </div>
                    <div className="criteria-bar-bg">
                      <div className="criteria-bar-fill" style={{ width: `${c.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="criteria-note">
                Auto-scoring and candidate ranking is done by the digital merit engine.
                Final approval is by the ADERF Selection Committee.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────── */}
      <section className="cta-section" id="apply">
        <div className="cta-inner">
          <div>
            <span className="cta-tag">Applications Open</span>
            <h2 className="cta-heading">
              उत्कर्ष Scholarship 2026 is Now<br />
              <span>Accepting Applications</span>
            </h2>
            <p className="cta-body">
              Launched every year on 15 June. Register before the deadline to ensure your
              application is reviewed. Only 11 scholarship seats are available.
            </p>
            <div className="cta-btns">
              <Link to="/apply" className="btn-white">Start Application</Link>
              <a href="#eligibility" className="btn-ghost">Check Requirements</a>
            </div>
          </div>

          <div className="cta-date-box">
            <div className="cta-date-label">Program Launch</div>
            <div className="cta-date-num">15</div>
            <div className="cta-date-month">June · Every Year</div>
          </div>
        </div>
      </section>

    </div>
  );
}

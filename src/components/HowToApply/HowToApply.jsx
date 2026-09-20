import { useState } from "react";
import { Link } from "react-router-dom";
import "./HowToApply.css";

const STEPS = [
  {
    num: 1,
    icon: "🌐",
    title: "Visit the Official Scholarship Portal",
    shortTitle: "Visit Portal",
    desc: "Go to the official Utkarsh Scholarship Program website and navigate to the Apply Now section.",
    details: [
      "Read the scholarship guidelines carefully",
      "Review all eligibility criteria",
      "Check required documents list",
      "Go through important instructions",
    ],
  },
  {
    num: 2,
    icon: "📱",
    title: "Student Registration",
    shortTitle: "Register",
    desc: "Create your student account by completing the registration process with OTP verification.",
    details: [
      "Enter your full name and mobile number",
      "Provide Email ID (optional but recommended)",
      "Create a secure password",
      "Verify via OTP sent to your mobile",
      "Account activated after verification",
    ],
  },
  {
    num: 3,
    icon: "📝",
    title: "Fill Scholarship Application Form",
    shortTitle: "Fill Form",
    desc: "Log in and complete the scholarship form with accurate personal, academic, and contact details.",
    details: [
      "Personal: Full name, father name, mother name, gender, DOB",
      "Academic: Class X, school name, education board, performance",
      "Contact: Mobile number, email ID, address details",
      "Location: State, district, city/village, pincode",
    ],
  },
  {
    num: 4,
    icon: "📤",
    title: "Upload Required Documents",
    shortTitle: "Upload Docs",
    desc: "Upload clear and valid supporting documents. Blurred or incomplete documents may lead to rejection.",
    details: [
      "Recent passport-size photograph (JPG/PNG, max 2MB)",
      "School Identity Card (if available)",
      "Previous class marksheet / report card",
      "UID / Aadhar card",
    ],
  },
  {
    num: 5,
    icon: "🔍",
    title: "Review Application Details",
    shortTitle: "Review",
    desc: "Before submitting, carefully review all information entered in the application form.",
    details: [
      "Ensure all information is accurate",
      "Confirm mobile number is active",
      "Verify documents are uploaded properly",
      "Check all educational details are correct",
    ],
  },
  {
    num: 6,
    icon: "✅",
    title: "Accept Declaration",
    shortTitle: "Declare",
    desc: "Read the applicant declaration carefully and confirm all submitted information is true and accurate.",
    details: [
      "Read the full declaration statement",
      "Tick the declaration checkbox to proceed",
      "False info may result in disqualification",
    ],
  },
  {
    num: 7,
    icon: "🚀",
    title: "Submit Application",
    shortTitle: "Submit",
    desc: "Click Submit Application after completing all steps. You will receive a unique registration number instantly.",
    details: [
      "Auto-generated Application / Registration Number",
      "Confirmation notification via SMS and email",
      "Track application status via Student Dashboard",
      "Download your Registration Receipt as PDF",
    ],
  },
];

const DOCUMENTS = [
  { icon: "🖼️", title: "Passport Photo",     desc: "Recent passport-size photo, JPG or PNG format, max 2MB" },
  { icon: "🪪",  title: "School ID Card",     desc: "School Identity Card (if available)" },
  { icon: "📋",  title: "Previous Marksheet", desc: "Previous class marksheet or report card" },
  { icon: "🆔",  title: "Aadhar / UID",       desc: "Government-issued UID or Aadhar card" },
];

const IMPORTANT_NOTES = [
  "Submit only genuine and accurate information.",
  "Ensure all documents are clear and readable.",
  "Keep your registered mobile number active for updates.",
  "Applications submitted after the deadline may not be considered.",
  "Multiple or duplicate applications may lead to cancellation.",
  "There is NO registration or examination fee at any stage.",
];

const FAQS = [
  {
    q: "Is there any application fee?",
    a: "No. The Utkarsh Scholarship Program is completely free of cost. There is no registration fee, application fee, or examination fee at any stage of the process.",
  },
  {
    q: "Can I edit my application after submission?",
    a: "No. Once the application is submitted it cannot be edited. Please review all details carefully before clicking Submit.",
  },
  {
    q: "How will I know if my application is received?",
    a: "After successful submission you will receive a unique Registration Number along with a confirmation notification via SMS and email.",
  },
  {
    q: "When will results be announced?",
    a: "Results are published on the official Utkarsh Scholarship Portal after the Selection Committee completes its evaluation. You can also track your status through your Student Dashboard.",
  },
];

export default function HowToApply() {
  const [activeStep, setActiveStep]   = useState(0);
  const [openFaq,    setOpenFaq]      = useState(null);

  const progress = Math.round(((activeStep + 1) / STEPS.length) * 100);

  return (
    <div className="hta-page">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="hta-hero">
        <div className="hta-hero-pattern" />
        <div className="hta-wrap">
          <div className="hta-eyebrow">How to Apply</div>
          <h1 className="hta-hero-title">
            Apply for <span className="hta-accent">उत्कर्ष</span> Scholarship 2026
          </h1>
          <p className="hta-hero-desc">
            A simple, transparent, and completely digital process.
            Follow the 7 steps below to submit your application for the
            Utkarsh Scholarship Program organized by ADERF.
          </p>

          {/* Quick-fact chips */}
          <div className="hta-chips">
            {[
              ["🆓", "Completely Free",  "No fees at any stage"],
              ["🖥️", "100% Online",      "Apply from anywhere" ],
              ["⏱️", "7 Easy Steps",     "Quick process"       ],
              ["📅", "Opens 15 June",    "Annual program"      ],
            ].map(([ic, label, sub]) => (
              <div className="hta-chip" key={label}>
                <span className="hta-chip-icon">{ic}</span>
                <div>
                  <div className="hta-chip-label">{label}</div>
                  <div className="hta-chip-sub">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STEP NAVIGATOR ────────────────────────────────────── */}
      <section className="hta-steps-section">
        <div className="hta-wrap">

          {/* Pill nav */}
          <div className="hta-pills">
            {STEPS.map((s, i) => (
              <button
                key={s.num}
                className={"hta-pill" + (activeStep === i ? " active" : i < activeStep ? " done" : "")}
                onClick={() => setActiveStep(i)}
              >
                <span className="hta-pill-num">
                  {i < activeStep ? "✓" : s.num}
                </span>
                <span className="hta-pill-txt">{s.shortTitle}</span>
              </button>
            ))}
          </div>

          {/* Two-column layout */}
          <div className="hta-layout">

            {/* LEFT – step list */}
            <div className="hta-list">
              {STEPS.map((s, i) => (
                <div
                  key={s.num}
                  className={"hta-item" + (activeStep === i ? " active" : "")}
                  onClick={() => setActiveStep(i)}
                >
                  {/* vertical connector */}
                  {i < STEPS.length - 1 && (
                    <div className={"hta-line" + (i < activeStep ? " done" : "")} />
                  )}

                  {/* circle */}
                  <div className={
                    "hta-circle" +
                    (activeStep === i ? " active" : i < activeStep ? " done" : "")
                  }>
                    {i < activeStep ? "✓" : s.num}
                  </div>

                  {/* text */}
                  <div className="hta-item-body">
                    <div className="hta-item-tag">Step {s.num}</div>
                    <div className="hta-item-title">{s.title}</div>
                    <div className="hta-item-desc">{s.desc}</div>
                  </div>

                  <div className="hta-item-icon">{s.icon}</div>
                </div>
              ))}
            </div>

            {/* RIGHT – detail card */}
            <div className="hta-card">
              <div className="hta-card-top">
                <span className="hta-card-step-label">
                  Step {STEPS[activeStep].num} of {STEPS.length}
                </span>
                <span className="hta-card-ico">{STEPS[activeStep].icon}</span>
              </div>

              <h3 className="hta-card-title">{STEPS[activeStep].title}</h3>
              <p  className="hta-card-desc" >{STEPS[activeStep].desc}</p>

              <div className="hta-card-divider" />
              <div className="hta-card-sub">What to do:</div>

              <ul className="hta-card-list">
                {STEPS[activeStep].details.map((d, i) => (
                  <li key={i} className="hta-card-li">
                    <span className="hta-card-dot" />{d}
                  </li>
                ))}
              </ul>

              {/* progress */}
              <div className="hta-prog-wrap">
                <div className="hta-prog-labels">
                  <span>Progress</span><span>{progress}%</span>
                </div>
                <div className="hta-prog-track">
                  <div className="hta-prog-fill" style={{ width: progress + "%" }} />
                </div>
              </div>

              {/* nav buttons */}
              <div className="hta-card-nav">
                <button
                  className="hta-btn-prev"
                  onClick={() => setActiveStep(p => Math.max(0, p - 1))}
                  disabled={activeStep === 0}
                >
                  ← Previous
                </button>

                {activeStep < STEPS.length - 1 ? (
                  <button
                    className="hta-btn-next"
                    onClick={() => setActiveStep(p => p + 1)}
                  >
                    Next Step →
                  </button>
                ) : (
                  <Link to="/apply" className="hta-btn-apply">
                    Apply Now →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DOCUMENTS ─────────────────────────────────────────── */}
      <section className="hta-docs">
        <div className="hta-wrap">
          <div className="hta-sec-eye">Documents Required</div>
          <h2 className="hta-sec-title">What to Keep Ready</h2>
          <div className="hta-sec-bar" />

          <div className="hta-docs-grid">
            {DOCUMENTS.map(d => (
              <div className="hta-doc-card" key={d.title}>
                <div className="hta-doc-icon">{d.icon}</div>
                <div className="hta-doc-title">{d.title}</div>
                <div className="hta-doc-desc">{d.desc}</div>
              </div>
            ))}
          </div>

          <div className="hta-doc-warn">
            <strong>Important:</strong> Blurred, incomplete, or invalid documents
            may lead to rejection during verification. Upload clear, legible copies only.
          </div>
        </div>
      </section>

      {/* ── IMPORTANT NOTES + CTA ─────────────────────────────── */}
      <section className="hta-notes">
        <div className="hta-notes-pattern" />
        <div className="hta-wrap hta-notes-grid">

          {/* notes */}
          <div>
            <div className="hta-sec-eye" style={{ color: "#f5a623" }}>Instructions</div>
            <h2 className="hta-sec-title" style={{ color: "#ffffff" }}>
              Important Notes for Applicants
            </h2>
            <div className="hta-sec-bar" />
            <ul className="hta-notes-list">
              {IMPORTANT_NOTES.map((n, i) => (
                <li key={i} className="hta-note-item">
                  <span className="hta-note-tick">✓</span>{n}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA box */}
          <div className="hta-cta-box">
            <div className="hta-cta-icon">🎓</div>
            <div className="hta-cta-hindi">उत्कर्ष 2026</div>
            <div className="hta-cta-tag">Apply with Confidence. Learn with Excellence.</div>

            <div className="hta-cta-rows">
              <div className="hta-cta-row">
                <span>Scholarship Amount</span><strong>₹5,000</strong>
              </div>
              <div className="hta-cta-row">
                <span>Seats Available</span>
                <strong style={{ color: "#f5a623" }}>11 only</strong>
              </div>
              <div className="hta-cta-row">
                <span>Application Fee</span>
                <strong style={{ color: "#4ade80" }}>Free</strong>
              </div>
            </div>

            <Link to="/apply" className="hta-cta-btn">Start Application →</Link>
            <div className="hta-cta-help">
              Need help? Call <strong>+91 6203281935</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section className="hta-faq">
        <div className="hta-wrap">
          <div className="hta-sec-eye">FAQ</div>
          <h2 className="hta-sec-title">Frequently Asked Questions</h2>
          <div className="hta-sec-bar" style={{ margin: "0 auto 32px" }} />

          <div className="hta-faq-list">
            {FAQS.map((f, i) => (
              <div
                key={i}
                className={"hta-faq-item" + (openFaq === i ? " open" : "")}
              >
                <button
                  className="hta-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{f.q}</span>
                  <span className="hta-faq-toggle">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div className="hta-faq-a">{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HELP STRIP ────────────────────────────────────────── */}
      <section className="hta-help">
        <div className="hta-wrap hta-help-inner">
          <div>
            <h3 className="hta-help-title">Need Assistance?</h3>
            <p className="hta-help-desc">
              For support regarding submission, eligibility, or technical issues,
              contact the Utkarsh Scholarship Helpdesk through official channels only.
            </p>
          </div>
          <div className="hta-help-contacts">
            {[
              ["📞", "+91 6203281935"],
              ["💬", "+91 9430249924 (WhatsApp)"],
              ["📧", "support.utkarsh@aderf.co.in"],
            ].map(([ic, val]) => (
              <div className="hta-help-row" key={val}>
                <span>{ic}</span><span>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
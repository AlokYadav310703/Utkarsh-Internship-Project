import { useMemo, useState } from "react";
import {
  BadgeCheck,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  GraduationCap,
  IdCard,
  IndianRupee,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  UploadCloud,
  UserRound,
} from "lucide-react";
import "./ApplyNow.css";

const INITIAL_FORM = {
  fullName: "",
  fatherName: "",
  motherName: "",
  mobile: "",
  email: "",
  dob: "",
  gender: "",
  schoolName: "",
  board: "",
  rollNumber: "",
  lastPercentage: "",
  state: "",
  district: "",
  city: "",
  pinCode: "",
  photo: "",
  schoolId: "",
  marksheet: "",
  aadhaar: "",
  declaration: false,
};

const REQUIRED_FIELDS = [
  "fullName",
  "fatherName",
  "motherName",
  "mobile",
  "dob",
  "gender",
  "schoolName",
  "board",
  "lastPercentage",
  "state",
  "district",
  "city",
  "pinCode",
  "photo",
  "marksheet",
  "aadhaar",
];

const FIELD_GROUPS = [
  {
    eyebrow: "Step 1",
    title: "Student Details",
    icon: UserRound,
    fields: [
      { name: "fullName", label: "Full Name", type: "text", placeholder: "Enter student full name" },
      { name: "fatherName", label: "Father Name", type: "text", placeholder: "Enter father name" },
      { name: "motherName", label: "Mother Name", type: "text", placeholder: "Enter mother name" },
      { name: "mobile", label: "Mobile Number", type: "tel", placeholder: "10-digit mobile number" },
      { name: "email", label: "Email ID", type: "email", placeholder: "Optional email address" },
      { name: "dob", label: "Date of Birth", type: "date" },
      {
        name: "gender",
        label: "Gender",
        type: "select",
        options: ["", "Female", "Male", "Other"],
      },
    ],
  },
  {
    eyebrow: "Step 2",
    title: "Academic Details",
    icon: GraduationCap,
    fields: [
      { name: "schoolName", label: "School Name", type: "text", placeholder: "Current school name" },
      {
        name: "board",
        label: "Education Board",
        type: "select",
        options: ["", "CBSE", "ICSE", "State Board", "Other Recognized Board"],
      },
      { name: "rollNumber", label: "Roll / Admission Number", type: "text", placeholder: "Optional school roll number" },
      { name: "lastPercentage", label: "Previous Class Percentage", type: "number", placeholder: "Example: 82" },
    ],
  },
  {
    eyebrow: "Step 3",
    title: "Address",
    icon: MapPin,
    fields: [
      { name: "state", label: "State", type: "text", placeholder: "Enter state" },
      { name: "district", label: "District", type: "text", placeholder: "Enter district" },
      { name: "city", label: "City / Village", type: "text", placeholder: "Enter city or village" },
      { name: "pinCode", label: "Pin Code", type: "text", placeholder: "6-digit pin code" },
    ],
  },
];

const DOCUMENT_FIELDS = [
  { name: "photo", label: "Passport Photo", helper: "JPG or PNG, maximum 2MB", icon: UserRound },
  { name: "schoolId", label: "School ID Card", helper: "Optional, upload if available", icon: IdCard },
  { name: "marksheet", label: "Previous Marksheet", helper: "Latest report card or marksheet", icon: FileText },
  { name: "aadhaar", label: "Aadhaar / UID", helper: "Clear government ID copy", icon: ShieldCheck },
];

const HIGHLIGHTS = [
  { label: "Award", value: "Rs. 5,000", icon: IndianRupee },
  { label: "Seats", value: "11", icon: BadgeCheck },
  { label: "Class", value: "X", icon: BookOpen },
  { label: "Fee", value: "Free", icon: CheckCircle2 },
];

export default function ApplyNow() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  const completed = useMemo(() => {
    const filled = REQUIRED_FIELDS.filter((field) => String(form[field]).trim()).length;
    return Math.round((filled / REQUIRED_FIELDS.length) * 100);
  }, [form]);

  const applicationId = useMemo(() => {
    const seed = form.mobile || form.fullName || "UTKARSH";
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
      hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
    }
    return `UTK-${new Date().getFullYear()}-${String(hash).padStart(5, "0")}`;
  }, [form.fullName, form.mobile]);

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) {
    return (
      <div className="apply-page">
        <section className="apply-success">
          <div className="apply-success-card">
            <div className="apply-success-icon">
              <CheckCircle2 size={42} />
            </div>
            <p className="apply-kicker">Application Saved</p>
            <h1>Thank you, {form.fullName || "Applicant"}</h1>
            <p>
              Your scholarship application draft has been completed on the frontend.
              Keep this reference number for tracking after backend submission is connected.
            </p>
            <div className="apply-ref">{applicationId}</div>
            <button className="apply-primary-btn" onClick={() => setSubmitted(false)}>
              Review Application
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="apply-page">
      <section className="apply-hero">
        <div className="apply-hero-inner">
          <div>
            <p className="apply-kicker">Utkarsh Scholarship 2026</p>
            <h1>Apply for the ADERF Annual Scholarship</h1>
            <p className="apply-hero-copy">
              Complete the student, academic, address, and document details below.
              Review everything carefully before submitting your application.
            </p>
            <div className="apply-contact-row">
              <span><Phone size={16} /> +91 6203281935</span>
              <span><Mail size={16} /> support.utkarsh@aderf.co.in</span>
            </div>
          </div>

          <aside className="apply-status-panel">
            <div className="apply-status-top">
              <ClipboardList size={22} />
              <span>Application Progress</span>
            </div>
            <strong>{completed}%</strong>
            <div className="apply-progress-track">
              <div className="apply-progress-fill" style={{ width: `${completed}%` }} />
            </div>
            <p>{REQUIRED_FIELDS.length} required fields must be completed before final submission.</p>
          </aside>
        </div>
      </section>

      <section className="apply-content">
        <div className="apply-main">
          <form className="apply-form" onSubmit={handleSubmit}>
            {FIELD_GROUPS.map((group) => {
              const Icon = group.icon;
              return (
                <section className="apply-form-section" key={group.title}>
                  <div className="apply-section-head">
                    <div className="apply-section-icon"><Icon size={20} /></div>
                    <div>
                      <span>{group.eyebrow}</span>
                      <h2>{group.title}</h2>
                    </div>
                  </div>

                  <div className="apply-field-grid">
                    {group.fields.map((field) => (
                      <label className="apply-field" key={field.name}>
                        <span>{field.label}</span>
                        {field.type === "select" ? (
                          <select
                            name={field.name}
                            value={form[field.name]}
                            onChange={handleChange}
                            required={REQUIRED_FIELDS.includes(field.name)}
                          >
                            <option value="">Select {field.label}</option>
                            {field.options.slice(1).map((option) => (
                              <option value={option} key={option}>{option}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            name={field.name}
                            type={field.type}
                            min={field.name === "lastPercentage" ? "0" : undefined}
                            max={field.name === "lastPercentage" ? "100" : undefined}
                            value={form[field.name]}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            required={REQUIRED_FIELDS.includes(field.name)}
                          />
                        )}
                      </label>
                    ))}
                  </div>
                </section>
              );
            })}

            <section className="apply-form-section">
              <div className="apply-section-head">
                <div className="apply-section-icon"><UploadCloud size={20} /></div>
                <div>
                  <span>Step 4</span>
                  <h2>Documents</h2>
                </div>
              </div>
              <div className="apply-doc-grid">
                {DOCUMENT_FIELDS.map((doc) => {
                  const Icon = doc.icon;
                  return (
                    <label className="apply-upload" key={doc.name}>
                      <Icon size={22} />
                      <strong>{doc.label}</strong>
                      <span>{doc.helper}</span>
                      <input
                        name={doc.name}
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          setForm((current) => ({ ...current, [doc.name]: file?.name || "" }));
                        }}
                        required={REQUIRED_FIELDS.includes(doc.name)}
                      />
                      <em>{form[doc.name] || "Choose file"}</em>
                    </label>
                  );
                })}
              </div>
            </section>

            <section className="apply-declaration">
              <label>
                <input
                  name="declaration"
                  type="checkbox"
                  checked={form.declaration}
                  onChange={handleChange}
                  required
                />
                <span>
                  I confirm that the information provided is true and the uploaded
                  documents are valid. I understand that incorrect details may lead to rejection.
                </span>
              </label>
            </section>

            <button className="apply-submit" type="submit">
              <Send size={18} />
              Submit Application
            </button>
          </form>
        </div>

        <aside className="apply-sidebar">
          <div className="apply-side-card">
            <h3>Scholarship Snapshot</h3>
            <div className="apply-highlight-grid">
              {HIGHLIGHTS.map((item) => {
                const Icon = item.icon;
                return (
                  <div className="apply-highlight" key={item.label}>
                    <Icon size={18} />
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="apply-side-card">
            <h3>Before You Submit</h3>
            <ul className="apply-checklist">
              <li><CheckCircle2 size={16} /> Mobile number is active for updates.</li>
              <li><CheckCircle2 size={16} /> Documents are clear and readable.</li>
              <li><CheckCircle2 size={16} /> Academic percentage is entered correctly.</li>
              <li><CalendarDays size={16} /> Applications open from 15 June 2026.</li>
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}

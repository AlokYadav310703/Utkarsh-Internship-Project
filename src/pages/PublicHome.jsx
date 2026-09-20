import { Award, BadgeCheck, BookOpenCheck, FileText, GraduationCap, HelpCircle, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

const highlights = [
  ["11", "Students selected every year"],
  ["Rs. 5,000", "One-time scholarship assistance"],
  ["Class X", "Eligible academic class"],
  ["Free", "No registration or exam fee"],
];

const steps = [
  "Register with email OTP verification",
  "Complete student and academic details",
  "Upload photo, marksheet, Aadhaar and school ID",
  "Submit application and track status",
];

const faqs = [
  ["Who can apply?", "Students currently studying in Class X in a recognized school can apply."],
  ["Is there any fee?", "No. Registration, application, and scholarship assessment are completely free."],
  ["Can I edit after submission?", "No. Drafts can be edited, but submitted applications are locked."],
  ["How many students are selected?", "A maximum of 11 meritorious students are selected per academic session."],
];

export default function PublicHome() {
  const { register, handleSubmit, reset } = useForm();
  const [contactMessage, setContactMessage] = useState("");
  const [contactError, setContactError] = useState("");
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  const apiUrl = (path) => `${String(api.defaults.baseURL || "").replace(/\/$/, "")}${path}`;

  const submitContact = async (values) => {
    setContactMessage("");
    setContactError("");
    setIsSubmittingContact(true);
    try {
      await api.post("/public/contact", {
        ...values,
        fullName: values.fullName?.trim(),
        mobile: values.mobile?.trim(),
        email: values.email?.trim(),
        registrationNumber: values.registrationNumber?.trim() || undefined,
        subject: values.subject?.trim(),
        message: values.message?.trim(),
      });
      setContactMessage("Your query has been submitted. The Utkarsh support team will contact you.");
      reset();
    } catch (err) {
      setContactError(err.response?.data?.message || "Unable to submit your query right now.");
    } finally {
      setIsSubmittingContact(false);
    }
  };

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-[#1a1a2e] px-4 py-20 text-white sm:px-6">
        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(45deg,#fff_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-md border border-[#f5a623]/30 bg-[#f5a623]/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#f5a623]">
              Utkarsh Annual Scholarship Program
            </p>
            <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
              Empowering young minds, inspiring bright futures.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">
              Utkarsh is ADERF's annual merit-based scholarship program for deserving Class X students.
              The portal manages registration, applications, document verification, assessment, results,
              certificates, and communication in one secure workflow.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="rounded-md bg-[#f5a623] px-6 py-3 text-sm font-black text-[#1a1a2e] shadow-lg shadow-black/20">
                Apply Now
              </Link>
              <a href="#eligibility" className="rounded-md border border-white/20 px-6 py-3 text-sm font-bold text-white hover:border-[#f5a623]">
                Check Eligibility
              </a>
            </div>
          </div>
          <div className="brand-ring rounded-lg border border-[#f5a623]/25 bg-white/8 p-6 backdrop-blur">
            <div className="grid gap-4">
              {highlights.map(([value, label]) => (
                <div key={label} className="flex items-center justify-between rounded-md bg-white/8 p-4">
                  <span className="text-sm text-slate-300">{label}</span>
                  <strong className="text-xl text-[#f5a623]">{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d98c0d]">About ADERF</p>
            <h2 className="mt-3 text-3xl font-black text-[#1a1a2e]">A transparent scholarship platform for educational excellence</h2>
            <p className="mt-5 leading-8 text-slate-600">
              The Asian Development Educational & Research Foundation identifies, recognizes, and supports
              academically sincere learners through a professionally managed scholarship process. Utkarsh
              reduces friction for applicants and gives administrators structured tools for fair review.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              [Award, "Merit-based evaluation"],
              [FileText, "Digital application records"],
              [BadgeCheck, "Document verification"],
              [GraduationCap, "Scholar certificate workflow"],
            ].map(([Icon, label]) => (
              <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <Icon className="text-[#d98c0d]" />
                <h3 className="mt-4 font-black text-[#1a1a2e]">{label}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="eligibility" className="bg-slate-50 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d98c0d]">Eligibility</p>
          <h2 className="mt-3 text-3xl font-black text-[#1a1a2e]">Who can apply</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              "Currently studying in Class X",
              "Enrolled in a recognized school",
              "CBSE, ICSE, State Board or equivalent",
              "Valid documents and authentic details",
            ].map((item) => (
              <div key={item} className="rounded-lg border border-slate-200 bg-white p-5 text-sm font-bold text-slate-700">
                <BookOpenCheck className="mb-4 text-[#d98c0d]" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-to-apply" className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d98c0d]">How to Apply</p>
          <h2 className="mt-3 text-3xl font-black text-[#1a1a2e]">Simple digital workflow</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step} className="rounded-lg bg-[#1a1a2e] p-6 text-white">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f5a623] font-black text-[#1a1a2e]">{index + 1}</span>
                <p className="mt-5 text-sm font-bold leading-6">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="results" className="bg-[#1a1a2e] px-4 py-16 text-white sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_380px] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f5a623]">Results</p>
            <h2 className="mt-3 text-3xl font-black">Year-wise selected scholars list</h2>
            <p className="mt-5 leading-8 text-slate-300">
              Official results are published by academic session after application review, document
              verification, merit evaluation, and final selection committee approval.
            </p>
          </div>
          <div className="rounded-lg border border-[#f5a623]/30 bg-white/8 p-6">
            {["2024-25", "2025-26", "2026-27"].map((year) => (
              <a
                key={year}
                href={apiUrl(`/public/results/${year}/pdf`)}
                target="_blank"
                rel="noreferrer"
                className="mb-3 flex items-center justify-between rounded-md bg-white/8 p-4 text-sm font-bold last:mb-0"
              >
                Academic Session {year}
                <span className="text-[#f5a623]">View PDF</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-xs font-black uppercase tracking-[0.18em] text-[#d98c0d]">FAQ</p>
          <h2 className="mt-3 text-center text-3xl font-black text-[#1a1a2e]">Frequently asked questions</h2>
          <div className="mt-8 grid gap-3">
            {faqs.map(([q, a]) => (
              <div key={q} className="rounded-lg border border-slate-200 bg-white p-5">
                <h3 className="flex items-center gap-2 font-black text-[#1a1a2e]"><HelpCircle size={18} className="text-[#d98c0d]" />{q}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-slate-50 px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_440px]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d98c0d]">Contact</p>
            <h2 className="mt-3 text-3xl font-black text-[#1a1a2e]">We are here to assist you</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3 lg:grid-cols-1">
              {[
                [Phone, "+91 6203281935", "Official mobile"],
                [Mail, "support.utkarsh@aderf.co.in", "Helpdesk email"],
                [MapPin, "Patna, Bihar - 800001", "ADERF office"],
              ].map(([Icon, value, label]) => (
                <div key={value} className="rounded-lg border border-slate-200 bg-white p-6">
                  <Icon className="text-[#d98c0d]" />
                  <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">{label}</p>
                  <p className="mt-2 font-black text-[#1a1a2e]">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(submitContact)} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-black text-[#1a1a2e]">Student Query Form</h3>
            <div className="mt-5 grid gap-3">
              <input {...register("fullName", { required: true })} placeholder="Full name" className="h-11 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#f5a623]" />
              <input {...register("mobile", { required: true })} placeholder="Mobile number" className="h-11 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#f5a623]" />
              <input type="email" {...register("email", { required: true })} placeholder="Email address" className="h-11 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#f5a623]" />
              <input {...register("registrationNumber")} placeholder="Registration number (optional)" className="h-11 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#f5a623]" />
              <input {...register("subject", { required: true })} placeholder="Subject" className="h-11 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#f5a623]" />
              <textarea {...register("message", { required: true })} placeholder="Message" className="min-h-28 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-[#f5a623]" />
              {contactMessage && <div className="rounded-md bg-green-50 p-3 text-sm font-bold text-green-700">{contactMessage}</div>}
              {contactError && <div className="rounded-md bg-red-50 p-3 text-sm font-bold text-red-700">{contactError}</div>}
              <button
                className="rounded-md bg-[#f5a623] px-5 py-3 text-sm font-black text-[#1a1a2e] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmittingContact}
              >
                {isSubmittingContact ? "Submitting..." : "Submit Query"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

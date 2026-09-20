import { Download, FileCheck2, FileText, GraduationCap, Link as LinkIcon, Medal } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

const statusStyle = {
  DRAFT: "bg-slate-100 text-slate-700",
  PENDING: "bg-amber-50 text-amber-700",
  UNDER_REVIEW: "bg-blue-50 text-blue-700",
  SHORTLISTED: "bg-indigo-50 text-indigo-700",
  SELECTED: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700",
};

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api.get("/student/dashboard")
      .then((res) => {
        if (!cancelled) setData(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || "Unable to load dashboard.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error && !data) return <div className="px-4 py-16 text-center font-bold text-red-600">{error}</div>;
  if (!data) return <div className="px-4 py-16 text-center font-bold">Loading dashboard...</div>;
  const { user, profile, application, notifications } = data;

  const downloadPdf = async (kind, label) => {
    setError("");
    try {
      const response = await api.get(`/student/documents/${kind}/pdf`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `${label.toLowerCase().replaceAll(" ", "-")}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.message || `Unable to download ${label}.`);
    }
  };

  const docs = [
    ["Registration Receipt", "receipt"],
    ["Application Form", "application"],
    ["Admit Card", "admit-card"],
    ["Selection Letter", "selection-letter"],
    ["Scholarship Certificate", "certificate"],
  ];

  return (
    <section className="bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d98c0d]">Student Dashboard</p>
            <h1 className="mt-2 text-3xl font-black text-[#1a1a2e]">Welcome, {user.name}</h1>
          </div>
          <Link to="/apply" className="rounded-md bg-[#f5a623] px-5 py-3 text-sm font-black text-[#1a1a2e]">
            {application.submittedAt ? "View Application" : "Complete Application"}
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-5">
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-500">Registration Number</p>
                  <h2 className="mt-1 text-2xl font-black text-[#1a1a2e]">{application.registrationNumber || "Not submitted yet"}</h2>
                </div>
                <span className={`rounded-full px-4 py-2 text-xs font-black ${statusStyle[application.status]}`}>
                  {application.status.replace("_", " ")}
                </span>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <Info icon={GraduationCap} label="School" value={profile?.schoolName || "Pending"} />
                <Info icon={Medal} label="Session" value={application.sessionYear} />
                <Info icon={FileCheck2} label="Documents" value={`${application.documents.length}/4 uploaded`} />
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="text-xl font-black text-[#1a1a2e]">Downloads</h3>
              {error && <div className="mt-4 rounded-md bg-red-50 p-3 text-sm font-bold text-red-700">{error}</div>}
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {docs.map(([label, kind]) => (
                  <button key={kind} type="button" onClick={() => downloadPdf(kind, label)} className="flex items-center justify-between rounded-md border border-slate-200 p-4 text-left text-sm font-bold text-slate-700 hover:border-[#f5a623]">
                    <span className="flex items-center gap-2"><Download size={17} className="text-[#d98c0d]" />{label}</span>
                    PDF
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="text-xl font-black text-[#1a1a2e]">Test and Result</h3>
              <div className="mt-5 grid gap-3">
                {application.testResults.length ? application.testResults.map((result) => (
                  <div key={result.id} className="rounded-md bg-slate-50 p-4">
                    <p className="font-black text-[#1a1a2e]">{result.test.title}</p>
                    <p className="mt-1 text-sm text-slate-600">Score: {result.score ?? "Pending"} / {result.maxScore} - {result.status}</p>
                    {result.test.testUrl && <a href={result.test.testUrl} className="mt-3 inline-flex items-center gap-2 text-sm font-black text-[#d98c0d]"><LinkIcon size={16} /> Open test link</a>}
                  </div>
                )) : <p className="text-sm text-slate-600">No scholarship test assigned yet.</p>}
              </div>
            </div>
          </div>

          <aside className="grid gap-5">
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="text-xl font-black text-[#1a1a2e]">Uploaded Documents</h3>
              <div className="mt-5 grid gap-3">
                {application.documents.map((doc) => (
                  <a key={doc.id} href={doc.publicUrl} target="_blank" rel="noreferrer" className="rounded-md bg-slate-50 p-4 text-sm">
                    <span className="flex items-center gap-2 font-black text-[#1a1a2e]"><FileText size={16} /> {doc.type.replace("_", " ")}</span>
                    <span className="mt-1 block text-slate-500">{doc.verification}</span>
                  </a>
                ))}
                {!application.documents.length && <p className="text-sm text-slate-600">No documents uploaded yet.</p>}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="text-xl font-black text-[#1a1a2e]">Notifications</h3>
              <div className="mt-5 grid gap-3">
                {notifications.map((item) => (
                  <div key={item.id} className="rounded-md bg-slate-50 p-4">
                    <p className="font-black text-[#1a1a2e]">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.message}</p>
                  </div>
                ))}
                {!notifications.length && <p className="text-sm text-slate-600">No notifications yet.</p>}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="rounded-md bg-slate-50 p-4">
      <Icon className="text-[#d98c0d]" size={20} />
      <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-1 font-black text-[#1a1a2e]">{value}</p>
    </div>
  );
}

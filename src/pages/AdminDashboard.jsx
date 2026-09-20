import { BarChart3, CheckCircle2, FileCheck2, Search, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../lib/api";

const statuses = ["PENDING", "UNDER_REVIEW", "SHORTLISTED", "SELECTED", "REJECTED"];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { register, handleSubmit, reset } = useForm();

  const load = async (filters = { search, status }) => {
    try {
      const [dash, apps, contactRes, faqRes] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/applications", { params: filters }),
        api.get("/admin/contacts"),
        api.get("/admin/faqs"),
      ]);

      setStats(dash.data.stats);
      setApplications(apps.data.applications);
      setContacts(contactRes.data.contacts);
      setFaqs(faqRes.data.faqs);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load admin dashboard.");
    }
  };

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.get("/admin/dashboard"),
      api.get("/admin/applications"),
      api.get("/admin/contacts"),
      api.get("/admin/faqs"),
    ])
      .then(([dash, apps, contactRes, faqRes]) => {
        if (cancelled) return;
        setStats(dash.data.stats);
        setApplications(apps.data.applications);
        setContacts(contactRes.data.contacts);
        setFaqs(faqRes.data.faqs);
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || "Unable to load admin dashboard.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const updateStatus = async (id, nextStatus) => {
    setError("");
    setMessage("");
    try {
      await api.patch(`/admin/applications/${id}/status`, { status: nextStatus });
      setMessage("Application status updated.");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update status.");
    }
  };

  const verifyDoc = async (id, verification) => {
    setError("");
    setMessage("");
    try {
      await api.patch(`/admin/documents/${id}/verify`, { verification });
      setMessage("Document verification updated.");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to verify document.");
    }
  };

  const publishResults = async () => {
    setError("");
    setMessage("");
    if (!selected.length) {
      setError("Select at least one application before publishing results.");
      return;
    }
    try {
      const sessionYear = applications.find((app) => app.id === selected[0])?.sessionYear || "2026-27";
      await api.post("/admin/results/publish", { sessionYear, applicationIds: selected.slice(0, 11) });
      setSelected([]);
      setMessage("Selected results published.");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to publish results.");
    }
  };

  const generateCertificate = async (applicationId) => {
    setError("");
    setMessage("");
    try {
      await api.post(`/admin/certificates/${applicationId}`, { type: "SCHOLARSHIP_CERTIFICATE" });
      setMessage("Certificate generated.");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to generate certificate.");
    }
  };

  const createFaq = async (values) => {
    setError("");
    setMessage("");
    try {
      await api.post("/admin/faqs", { ...values, sortOrder: Number(values.sortOrder || 0), isActive: true });
      reset();
      setMessage("FAQ added.");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add FAQ.");
    }
  };

  return (
    <section className="bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d98c0d]">Admin Panel</p>
          <h1 className="mt-2 text-3xl font-black text-[#1a1a2e]">Scholarship Management Dashboard</h1>
          {message && <div className="mt-4 rounded-md bg-green-50 p-3 text-sm font-bold text-green-700">{message}</div>}
          {error && <div className="mt-4 rounded-md bg-red-50 p-3 text-sm font-bold text-red-700">{error}</div>}
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Stat icon={UsersRound} label="Total Applicants" value={stats?.totalApplicants ?? 0} />
          <Stat icon={CheckCircle2} label="Selected Students" value={stats?.selectedStudents ?? 0} />
          <Stat icon={FileCheck2} label="Pending Reviews" value={stats?.pendingReviews ?? 0} />
          <Stat icon={BarChart3} label="New Contacts" value={stats?.contacts ?? 0} />
        </div>

        <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-black text-[#1a1a2e]">Applications</h2>
            <div className="flex flex-wrap gap-3">
              <label className="flex h-11 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3">
                <Search size={16} />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search applicant" className="bg-transparent text-sm outline-none" />
              </label>
              <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-11 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-bold">
                <option value="">All Status</option>
                {statuses.map((item) => <option key={item}>{item}</option>)}
              </select>
              <button onClick={() => { setError(""); void load(); }} className="rounded-md bg-[#1a1a2e] px-4 py-2 text-sm font-black text-white">Apply Filter</button>
              <button onClick={publishResults} className="rounded-md bg-[#f5a623] px-4 py-2 text-sm font-black text-[#1a1a2e]">Publish Selected</button>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="p-3">Pick</th>
                  <th className="p-3">Student</th>
                  <th className="p-3">Registration</th>
                  <th className="p-3">School</th>
                  <th className="p-3">Documents</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-t border-slate-100 align-top">
                    <td className="p-3">
                      <input type="checkbox" checked={selected.includes(app.id)} onChange={(event) => setSelected((items) => event.target.checked ? [...items, app.id].slice(0, 11) : items.filter((id) => id !== app.id))} />
                    </td>
                    <td className="p-3">
                      <strong className="block text-[#1a1a2e]">{app.user.name}</strong>
                      <span className="text-slate-500">{app.user.email}</span>
                    </td>
                    <td className="p-3 font-bold">{app.registrationNumber || "-"}</td>
                    <td className="p-3">{app.user.profile?.schoolName || "-"}</td>
                    <td className="p-3">
                      <div className="grid gap-2">
                        {app.documents.map((doc) => (
                          <div key={doc.id} className="flex items-center gap-2">
                            <a href={doc.publicUrl} target="_blank" rel="noreferrer" className="font-bold text-[#d98c0d]">{doc.type}</a>
                            <button onClick={() => verifyDoc(doc.id, "VERIFIED")} className="rounded bg-green-50 px-2 py-1 text-xs font-bold text-green-700">Verify</button>
                            <button onClick={() => verifyDoc(doc.id, "INVALID")} className="rounded bg-red-50 px-2 py-1 text-xs font-bold text-red-700">Flag</button>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">{app.status}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        {statuses.slice(1).map((item) => (
                          <button key={item} onClick={() => updateStatus(app.id, item)} className="rounded-md border border-slate-200 px-2 py-1 text-xs font-bold hover:border-[#f5a623]">
                            {item}
                          </button>
                        ))}
                        {app.status === "SELECTED" && (
                          <button onClick={() => generateCertificate(app.id)} className="rounded-md bg-[#f5a623] px-2 py-1 text-xs font-black text-[#1a1a2e]">
                            Certificate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-black text-[#1a1a2e]">FAQ Management</h2>
            <form onSubmit={handleSubmit(createFaq)} className="mt-5 grid gap-3">
              <input {...register("question", { required: true })} placeholder="Question" className="h-11 rounded-md border border-slate-200 bg-slate-50 px-3" />
              <textarea {...register("answer", { required: true })} placeholder="Answer" className="min-h-24 rounded-md border border-slate-200 bg-slate-50 p-3" />
              <input {...register("sortOrder")} placeholder="Sort order" className="h-11 rounded-md border border-slate-200 bg-slate-50 px-3" />
              <button className="rounded-md bg-[#f5a623] px-4 py-3 text-sm font-black text-[#1a1a2e]">Add FAQ</button>
            </form>
            <div className="mt-5 grid gap-3">
              {faqs.slice(0, 5).map((faq) => <div key={faq.id} className="rounded-md bg-slate-50 p-3 text-sm font-bold">{faq.question}</div>)}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-black text-[#1a1a2e]">Contact Queries</h2>
            <div className="mt-5 grid gap-3">
              {contacts.slice(0, 8).map((contact) => (
                <div key={contact.id} className="rounded-md bg-slate-50 p-4">
                  <div className="flex justify-between gap-3">
                    <strong className="text-[#1a1a2e]">{contact.subject}</strong>
                    <span className="text-xs font-black text-[#d98c0d]">{contact.status}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{contact.fullName} - {contact.mobile}</p>
                  <p className="mt-2 text-sm text-slate-600">{contact.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <Icon className="text-[#d98c0d]" />
      <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-black text-[#1a1a2e]">{value}</p>
    </div>
  );
}

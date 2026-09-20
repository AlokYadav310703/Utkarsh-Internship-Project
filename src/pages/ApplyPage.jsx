import { AlertCircle, CheckCircle2, UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../lib/api";

const documentTypes = [
  ["PASSPORT_PHOTO", "Passport Photo"],
  ["SCHOOL_ID", "School ID Card"],
  ["MARKSHEET", "Previous Marksheet"],
  ["AADHAAR", "Aadhaar / UID"],
];

export default function ApplyPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [application, setApplication] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingType, setUploadingType] = useState("");

  const applyApplicationData = (data) => {
    setApplication(data.application);
    reset({
      profile: {
        ...data.profile,
        currentClass: "X",
        dateOfBirth: data.profile?.dateOfBirth?.slice(0, 10),
      },
    });
  };

  const load = async () => {
    const { data } = await api.get("/student/application");
    applyApplicationData(data);
  };

  useEffect(() => {
    let cancelled = false;
    api.get("/student/application")
      .then(({ data }) => {
        if (cancelled) return;
        setApplication(data.application);
        reset({
          profile: {
            ...data.profile,
            currentClass: "X",
            dateOfBirth: data.profile?.dateOfBirth?.slice(0, 10),
          },
        });
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message || "Unable to load application.");
      });
    return () => {
      cancelled = true;
    };
  }, [reset]);

  const draftPayload = (values) => ({
    ...values,
    profile: {
      ...values.profile,
      currentClass: "X",
      previousPercentage: values.profile?.previousPercentage === "" ? undefined : values.profile?.previousPercentage,
    },
  });

  const saveDraftRequest = async (values) => {
    const { data } = await api.post("/student/application/draft", draftPayload(values));
    applyApplicationData(data);
    return data;
  };

  const saveDraft = async (values) => {
    setError("");
    setMessage("");
    setIsSaving(true);
    try {
      await saveDraftRequest(values);
      setMessage("Draft saved successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save draft");
    } finally {
      setIsSaving(false);
    }
  };

  const submitApplication = async (values) => {
    setError("");
    setMessage("");
    setIsSubmitting(true);
    try {
      await saveDraftRequest(values);
      const { data } = await api.post("/student/application/submit");
      setApplication(data.application);
      setMessage(`Application submitted. Registration number: ${data.application.registrationNumber}`);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadDocument = async (type, file) => {
    if (!file) return;
    setError("");
    setMessage("");
    setUploadingType(type);
    try {
      const form = new FormData();
      form.append("file", file);
      await api.post(`/student/documents/${type}`, form, { headers: { "Content-Type": "multipart/form-data" } });
      setMessage("Document uploaded successfully.");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to upload document");
    } finally {
      setUploadingType("");
    }
  };

  if (!application && error) return <div className="px-4 py-16 text-center font-bold text-red-600">{error}</div>;
  if (!application) return <div className="px-4 py-16 text-center font-bold">Loading application...</div>;
  const locked = Boolean(application.submittedAt);

  return (
    <section className="bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#d98c0d]">Scholarship Application</p>
          <h1 className="mt-2 text-3xl font-black text-[#1a1a2e]">Utkarsh Annual Scholarship Program</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Complete each section, upload required documents, save your draft, then submit for review.
          </p>
          {locked && <p className="mt-3 rounded-md bg-amber-50 p-3 text-sm font-bold text-amber-700">This application has been submitted and cannot be edited.</p>}
        </div>

        <form onSubmit={handleSubmit(saveDraft)} className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-6">
            <Panel title="Personal Information">
              <Grid>
                <Field label="Father Name" error={errors.profile?.fatherName}><input disabled={locked} {...register("profile.fatherName", { required: true })} /></Field>
                <Field label="Mother Name" error={errors.profile?.motherName}><input disabled={locked} {...register("profile.motherName", { required: true })} /></Field>
                <Field label="Gender" error={errors.profile?.gender}><select disabled={locked} {...register("profile.gender", { required: true })}><option value="">Select gender</option><option>Female</option><option>Male</option><option>Other</option></select></Field>
                <Field label="Date of Birth" error={errors.profile?.dateOfBirth}><input disabled={locked} type="date" {...register("profile.dateOfBirth", { required: true })} /></Field>
              </Grid>
            </Panel>

            <Panel title="Academic Information">
              <Grid>
                <Field label="Current Class"><input readOnly value="X" {...register("profile.currentClass")} /></Field>
                <Field label="School Name" error={errors.profile?.schoolName}><input disabled={locked} {...register("profile.schoolName", { required: true })} /></Field>
                <Field label="Education Board" error={errors.profile?.educationBoard}><select disabled={locked} {...register("profile.educationBoard", { required: true })}><option value="">Select board</option><option>CBSE</option><option>ICSE</option><option>State Board</option><option>Other Recognized Board</option></select></Field>
                <Field label="Previous Percentage" error={errors.profile?.previousPercentage}><input disabled={locked} type="number" min="0" max="100" {...register("profile.previousPercentage", { required: true })} /></Field>
                <Field label="Roll Number"><input disabled={locked} {...register("profile.rollNumber")} /></Field>
              </Grid>
            </Panel>

            <Panel title="Contact and Location">
              <Grid>
                <Field label="Address"><input disabled={locked} {...register("profile.address")} /></Field>
                <Field label="State"><input disabled={locked} {...register("profile.state", { required: true })} /></Field>
                <Field label="District"><input disabled={locked} {...register("profile.district", { required: true })} /></Field>
                <Field label="City / Village"><input disabled={locked} {...register("profile.city", { required: true })} /></Field>
                <Field label="Pin Code"><input disabled={locked} {...register("profile.pinCode", { required: true })} /></Field>
              </Grid>
            </Panel>

            {!locked && (
              <div className="flex flex-wrap gap-3">
                <button type="submit" disabled={isSaving || isSubmitting} className="rounded-md bg-[#1a1a2e] px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-60">
                  {isSaving ? "Saving..." : "Save Draft"}
                </button>
                <button type="button" disabled={isSaving || isSubmitting} onClick={handleSubmit(submitApplication)} className="rounded-md bg-[#f5a623] px-5 py-3 text-sm font-black text-[#1a1a2e] disabled:cursor-not-allowed disabled:opacity-60">
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            )}
          </div>

          <aside className="grid content-start gap-6">
            <Panel title="Required Documents">
              <div className="grid gap-3">
                {documentTypes.map(([type, label]) => {
                  const uploaded = application.documents.find((doc) => doc.type === type);
                  return (
                    <label key={type} className="cursor-pointer rounded-md border border-dashed border-slate-300 bg-slate-50 p-4">
                      <span className="flex items-center gap-2 font-black text-[#1a1a2e]"><UploadCloud size={17} className="text-[#d98c0d]" /> {label}</span>
                      <span className="mt-1 block text-xs text-slate-500">
                        {uploadingType === type ? "Uploading..." : uploaded ? `${uploaded.originalName} - ${uploaded.verification}` : "JPG, PNG, or PDF up to 2MB"}
                      </span>
                      {!locked && <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="mt-3 block text-xs" onChange={(event) => uploadDocument(type, event.target.files?.[0])} disabled={Boolean(uploadingType)} />}
                    </label>
                  );
                })}
              </div>
            </Panel>
            <Panel title="Application Checklist">
              <div className="grid gap-3 text-sm text-slate-600">
                <ChecklistItem done={application.documents.some((doc) => doc.type === "PASSPORT_PHOTO")} label="Passport photo uploaded" />
                <ChecklistItem done={application.documents.some((doc) => doc.type === "MARKSHEET")} label="Previous marksheet uploaded" />
                <ChecklistItem done={application.documents.some((doc) => doc.type === "AADHAAR")} label="Aadhaar or UID uploaded" />
                <ChecklistItem done={locked} label="Final application submitted" />
              </div>
            </Panel>
            {message && <div className="rounded-md bg-green-50 p-4 text-sm font-bold text-green-700">{message}</div>}
            {error && <div className="rounded-md bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}
          </aside>
        </form>
      </div>
    </section>
  );
}

function Panel({ title, children }) {
  return <section className="rounded-lg border border-slate-200 bg-white p-6"><h2 className="mb-5 text-xl font-black text-[#1a1a2e]">{title}</h2>{children}</section>;
}

function Grid({ children }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

function Field({ label, children, error }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-[#1a1a2e]">
      {label}
      <span className="[&>input]:h-11 [&>input]:w-full [&>input]:rounded-md [&>input]:border [&>input]:border-slate-200 [&>input]:bg-slate-50 [&>input]:px-3 [&>select]:h-11 [&>select]:w-full [&>select]:rounded-md [&>select]:border [&>select]:border-slate-200 [&>select]:bg-slate-50 [&>select]:px-3">
        {children}
      </span>
      {error && <span className="text-xs text-red-600">Required</span>}
    </label>
  );
}

function ChecklistItem({ done, label }) {
  const Icon = done ? CheckCircle2 : AlertCircle;
  return (
    <div className="flex items-center gap-2 rounded-md bg-slate-50 p-3">
      <Icon size={16} className={done ? "text-green-600" : "text-amber-600"} />
      <span className="font-bold text-[#1a1a2e]">{label}</span>
    </div>
  );
}

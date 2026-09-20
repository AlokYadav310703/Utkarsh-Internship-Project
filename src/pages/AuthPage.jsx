import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/auth";

export default function AuthPage({ mode }) {
  const [searchParams] = useSearchParams();
  const { register, handleSubmit, getValues, reset, formState: { errors } } = useForm({
    defaultValues: { email: searchParams.get("email") || "" },
  });
  const { login, register: createAccount, verifyEmail } = useAuth();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [forgotStep, setForgotStep] = useState("request");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const title = {
    login: "Login to your account",
    register: "Create student account",
    verify: "Verify email OTP",
    forgot: "Reset password",
  }[mode];

  const submit = async (values) => {
    setError("");
    setMessage("");
    setIsSubmitting(true);
    try {
      if (mode === "login") {
        const user = await login(values);
        if (user.role === "STUDENT" && !user.isEmailVerified) {
          setMessage("Please verify your email OTP before opening the student dashboard.");
          navigate(`/verify-email?email=${encodeURIComponent(user.email)}`);
          return;
        }
        navigate(user.role === "STUDENT" ? "/dashboard" : "/admin");
      }
      if (mode === "register") {
        await createAccount(values);
        setMessage("Account created. Check your email for the OTP, then verify your account.");
        navigate(`/verify-email?email=${encodeURIComponent(values.email)}`);
      }
      if (mode === "verify") {
        const user = await verifyEmail(values);
        navigate(user.role === "STUDENT" ? "/dashboard" : "/admin");
      }
      if (mode === "forgot") {
        if (forgotStep === "request") {
          await api.post("/auth/forgot-password", { email: values.email });
          setForgotStep("reset");
          setMessage("If the email exists, a reset OTP has been sent.");
        } else {
          await api.post("/auth/reset-password", {
            email: values.email,
            otp: values.otp,
            password: values.password,
          });
          setMessage("Password reset successful. You can login now.");
          setForgotStep("request");
          reset({ email: values.email });
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const buttonLabel = {
    login: "Login",
    register: "Register",
    verify: "Verify Email",
    forgot: forgotStep === "request" ? "Send Reset OTP" : "Reset Password",
  }[mode];

  const resendVerification = async () => {
    setError("");
    setMessage("");
    const email = getValues("email");
    if (!email) {
      setError("Email is required to resend OTP.");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post("/auth/resend-verification", { email });
      setMessage("If this account is not verified, a new OTP has been sent.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to resend OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-[720px] bg-slate-50 px-4 py-12 sm:px-6">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-lg bg-white shadow-2xl shadow-slate-200 lg:grid-cols-[420px_1fr]">
        <div className="bg-[#1a1a2e] p-10 text-white">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f5a623]">Secure Portal</p>
          <h1 className="mt-4 text-4xl font-black leading-tight">{title}</h1>
          <p className="mt-5 text-sm leading-7 text-slate-300">
            {mode === "forgot"
              ? "Enter your registered email first. After receiving the OTP, set a new password."
              : "Email OTP verification is mandatory before a student can submit the scholarship application."}
          </p>
        </div>
        <form onSubmit={handleSubmit(submit)} className="grid gap-5 p-8">
          {mode === "register" && (
            <>
              <Field label="Full Name" error={errors.name} input={<input {...register("name", { required: true })} />} />
              <Field label="Mobile Number" error={errors.mobile} input={<input {...register("mobile", { required: true, minLength: 10 })} />} />
            </>
          )}
          <Field label="Email" error={errors.email} input={<input type="email" readOnly={mode === "verify" || (mode === "forgot" && forgotStep === "reset")} className={(mode === "verify" || (mode === "forgot" && forgotStep === "reset")) ? "opacity-70 cursor-not-allowed" : ""} {...register("email", { required: true })} />} />
          {mode !== "verify" && mode !== "forgot" && (
            <Field label="Password" error={errors.password} input={<input type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} {...register("password", { required: true, minLength: 8 })} />} />
          )}
          {mode === "forgot" && forgotStep === "reset" && (
            <>
              <Field label="Reset OTP" error={errors.otp} input={<input inputMode="numeric" {...register("otp", { required: true, minLength: 6, maxLength: 6 })} />} />
              <Field label="New Password" error={errors.password} input={<input type="password" autoComplete="new-password" {...register("password", { required: true, minLength: 8 })} />} />
            </>
          )}
          {mode === "verify" && (
            <Field label="OTP" error={errors.otp} input={<input inputMode="numeric" {...register("otp", { required: true, minLength: 6, maxLength: 6 })} />} />
          )}
          {message && <div className="rounded-md bg-green-50 p-3 text-sm font-bold text-green-700">{message}</div>}
          {error && <div className="rounded-md bg-red-50 p-3 text-sm font-bold text-red-700">{error}</div>}
          <button disabled={isSubmitting} className="rounded-md bg-[#f5a623] px-5 py-3 font-black text-[#1a1a2e] disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? "Please wait..." : buttonLabel}
          </button>
          {mode === "verify" && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={resendVerification}
              className="rounded-md border border-slate-200 px-5 py-3 text-sm font-black text-[#1a1a2e] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Resend OTP
            </button>
          )}
          {mode === "forgot" && forgotStep === "reset" && (
            <button
              type="button"
              className="rounded-md border border-slate-200 px-5 py-3 text-sm font-black text-[#1a1a2e]"
              onClick={() => {
                setForgotStep("request");
                setError("");
                setMessage("");
              }}
            >
              Use different email
            </button>
          )}
          <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-600">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/forgot-password">Forgot password</Link>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({ label, input, error }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-[#1a1a2e]">
      {label}
      <span className="block [&>input]:h-12 [&>input]:w-full [&>input]:rounded-md [&>input]:border [&>input]:border-slate-200 [&>input]:bg-slate-50 [&>input]:px-3 [&>input]:outline-none [&>input:focus]:border-[#f5a623]">
        {input}
      </span>
      {error && <span className="text-xs text-red-600">This field is required or invalid.</span>}
    </label>
  );
}

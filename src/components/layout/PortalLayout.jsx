import { Menu, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import logo from "../../assets/logo.jpeg";

const nav = [
  { label: "About", to: "/#about" },
  { label: "Eligibility", to: "/#eligibility" },
  { label: "How To Apply", to: "/how-to-apply", route: true },
  { label: "Results", to: "/#results" },
  { label: "FAQ", to: "/#faq" },
  { label: "Contact", to: "/#contact" },
];

export default function PortalLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const doLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#f5a623] px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.18em] text-[#1a1a2e]">
        ADERF Annual Scholarship 2026 - Free registration for Class X students
      </div>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#1a1a2e] text-white shadow-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-md border border-[#f5a623]/35 bg-white p-1 shadow-sm">
              <img src={logo} alt="Utkarsh Scholarship logo" className="h-full w-full object-contain" />
            </span>
            <span>
              <span className="block text-lg font-black leading-5 text-[#f5a623]">Utkarsh</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                ADERF Scholarship
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => item.route ? (
              <NavLink key={item.label} to={item.to} className="rounded-md px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-[#f5a623]">
                {item.label}
              </NavLink>
            ) : (
              <a key={item.label} href={item.to} className="rounded-md px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-[#f5a623]">
                {item.label}
              </a>
            ))}
            {user?.role === "STUDENT" && <NavLink to="/dashboard" className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-white/10">Dashboard</NavLink>}
            {["ADMIN", "SUPER_ADMIN"].includes(user?.role) && <NavLink to="/admin" className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-white/10">Admin</NavLink>}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {user ? (
              <>
                <span className="inline-flex items-center gap-2 rounded-md border border-[#f5a623]/30 px-3 py-2 text-xs font-bold text-[#f5a623]">
                  <ShieldCheck size={15} /> {user.name}
                </span>
                <button onClick={doLogout} className="rounded-md bg-white px-4 py-2 text-sm font-bold text-[#1a1a2e]">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-md px-4 py-2 text-sm font-bold text-slate-200 hover:bg-white/10">Login</Link>
                <Link to="/register" className="rounded-md bg-[#f5a623] px-4 py-2 text-sm font-black text-[#1a1a2e]">Apply Now</Link>
              </>
            )}
          </div>

          <button className="lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <div className="border-t border-white/10 bg-[#111126] px-4 py-4 lg:hidden">
            <div className="grid gap-2">
              {nav.map((item) => item.route ? (
                <Link key={item.label} to={item.to} className="py-2 text-sm font-semibold text-slate-200" onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              ) : (
                <a key={item.label} href={item.to} className="py-2 text-sm font-semibold text-slate-200" onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              ))}
              <Link to={user ? (user.role === "STUDENT" ? "/dashboard" : "/admin") : "/login"} className="rounded-md bg-[#f5a623] px-4 py-3 text-center text-sm font-black text-[#1a1a2e]" onClick={() => setOpen(false)}>
                {user ? "Open Dashboard" : "Login / Apply"}
              </Link>
            </div>
          </div>
        )}
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="bg-[#101024] px-4 py-10 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-xl font-black text-[#f5a623]">Utkarsh Scholarship</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              A flagship educational excellence initiative by Asian Development Educational & Research Foundation.
            </p>
          </div>
          <div className="text-sm leading-7 text-slate-300">
            <strong className="text-white">Helpdesk</strong><br />
            +91 6203281935<br />
            +91 9430249924<br />
            support.utkarsh@aderf.co.in
          </div>
          <div className="text-sm leading-7 text-slate-300">
            <strong className="text-white">Office</strong><br />
            202 Manju Sadan, Yarpur Rajputana<br />
            Patna, Bihar - 800001
          </div>
        </div>
      </footer>
    </div>
  );
}

import { FormEvent, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../app/AuthProvider";
import { notify } from "../app/ToastBoundary";
import {
  isSelection,
  isSelectionWithTicket,
  hasToken,
  loginAdmin,
  selectTenant,
  TenantOption,
  extractToken,
} from "../services/AuthService";
import logo from "../assets/images/logo_black.png";

type Stage = "form" | "select";

export default function Login() {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const from = location.state?.from?.pathname ?? "/";

  const [stage, setStage] = useState<Stage>("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  // For selection stage
  const [choices, setChoices] = useState<TenantOption[]>([]);
  const [loginTicket, setLoginTicket] = useState<string | null>(null); // Keep loginTicket in component state only

  async function submitCredentials(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await loginAdmin({ email, password });

      // Handle legacy selection response (no loginTicket)
      if (isSelection(res)) {
        if (!res.tenants?.length)
          throw new Error("No tenants available for this user.");
        setChoices(res.tenants);
        setStage("select");
        notify.info("Choose a company to continue");
        return;
      }

      // Handle new selection response with loginTicket
      if (isSelectionWithTicket(res)) {
        if (!res.tenants?.length)
          throw new Error("No tenants available for this user.");
        setChoices(res.tenants);
        setLoginTicket(res.loginTicket); // Store loginTicket in component state
        setStage("select");
        notify.info("Choose a company to continue");
        return;
      }

      // Handle direct success (single tenant)
      if (hasToken(res)) {
        setToken(extractToken(res));
        notify.success("Logged in");
        navigate(from, { replace: true });
        return;
      }

      throw new Error("Unexpected login response");
    } catch (e: any) {
      notify.error(e?.message ?? "Login failed");
    } finally {
      setBusy(false);
    }
  }

  async function chooseTenant(t: TenantOption) {
    setBusy(true);
    try {
      let res;

      if (loginTicket) {
        // New flow: Use loginTicket with selectTenant
        res = await selectTenant(t.tenantId, loginTicket);
        setLoginTicket(null); // Clear loginTicket from state after use
      } else {
        // Legacy flow: Re-login with tenantId
        res = await loginAdmin({ email, password, tenantId: t.tenantId });
        if (!hasToken(res))
          throw new Error("Unexpected response when selecting tenant");
      }

      setToken(extractToken(res)); // AuthProvider effect will store tenantId from JWT
      notify.success(`Logged in to ${t.tenantName}`);
      navigate(from, { replace: true });
    } catch (e: any) {
      notify.error(e?.message ?? "Failed to finalize login");
      setLoginTicket(null); // Clear loginTicket on error
    } finally {
      setBusy(false);
    }
  }

  if (stage === "select") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Choose Company
              </h1>
              <p className="text-sm text-slate-600">
                Select the company you want to access
              </p>
            </div>

            {/* Company List */}
            <div className="space-y-3 mb-6">
              {choices.map((c) => (
                <button
                  key={c.tenantId}
                  onClick={() => chooseTenant(c)}
                  disabled={busy}
                  className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900 group-hover:text-indigo-900">
                        {c.tenantName}
                      </div>
                      <div className="text-sm text-slate-500 mt-1">
                        Role: {c.role ?? "Not specified"}
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-slate-400 group-hover:text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>
              ))}
            </div>

            {/* Back Button */}
            <button
              onClick={() => {
                setStage("form");
                setLoginTicket(null);
              }}
              className="w-full text-center text-sm text-slate-600 hover:text-slate-900 font-medium py-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              ← Back to login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Stage: form
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-5rem)]">
          {/* LEFT: Login card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 sm:p-10 lg:p-12 max-w-md mx-auto w-full">
            {/* Logo/Icon */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-slate-600 leading-relaxed">
                Sign in to your admin dashboard
              </p>
            </div>

            <form onSubmit={submitCredentials} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-4 pl-12 text-slate-900 placeholder-slate-500 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                    required
                  />
                  <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-4 pl-12 text-slate-900 placeholder-slate-500 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>

              {/* Row: Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 focus:ring-2"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-4 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {busy ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </button>

              {/* Footer link */}
              <p className="text-center text-sm text-slate-600 pt-4">
                Need help?{" "}
                <a
                  className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                  href="#"
                >
                  Contact support
                </a>
              </p>
            </form>
          </div>

          {/* RIGHT: Illustration */}
          <div className="hidden lg:flex lg:flex-col lg:justify-center lg:items-center text-center">
            <div className="relative">
              {/* Background decoration */}
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-3xl transform rotate-3"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl transform -rotate-3"></div>

              {/* Logo */}
              <div className="relative bg-white rounded-2xl shadow-2xl p-8">
                <img
                  src={logo}
                  alt="Taxi Admin Dashboard"
                  className="w-full max-w-lg mx-auto"
                />
              </div>
            </div>

            {/* Text content */}
            <div className="mt-12 max-w-lg">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Professional Taxi Management
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Manage drivers, track rides, and analyze performance
                all in one place.
              </p>

              {/* Feature highlights */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Real-time tracking</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Driver management</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Payment processing</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Analytics & reports</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

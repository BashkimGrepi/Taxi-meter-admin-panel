import { FormEvent, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../app/AuthProvider';
import { notify } from '../app/ToastBoundary';
import { isSelection, hasToken, loginAdmin, TenantOption, extractToken } from '../services/AuthService';
import auth from '../assets/images/auth.svg'

type Stage = 'form' | 'select';

export default function Login() {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const from = location.state?.from?.pathname ?? '/';

  const [stage, setStage] = useState<Stage>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  // For selection stage
  const [choices, setChoices] = useState<TenantOption[]>([]);

  async function submitCredentials(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await loginAdmin({ email, password });
      if (isSelection(res)) {
        if (!res.tenants?.length) throw new Error('No tenants available for this user.');
        setChoices(res.tenants);
        setStage('select');
        notify.info('Choose a company to continue');
        return;
      }
      if (hasToken(res)) {
        setToken(extractToken(res));
        notify.success('Logged in');
        navigate(from, { replace: true });
        return;
      }
      throw new Error('Unexpected login response');
    } catch (e: any) {
      notify.error(e?.message ?? 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  async function chooseTenant(t: TenantOption) {
    setBusy(true);
    try {
      const res = await loginAdmin({ email, password, tenantId: t.tenantId });
      if (!hasToken(res)) throw new Error('Unexpected response when selecting tenant');
      setToken(extractToken(res)); // AuthProvider effect will store tenantId from JWT
      notify.success(`Logged in to ${t.tenantName}`);
      navigate(from, { replace: true });
    } catch (e: any) {
      notify.error(e?.message ?? 'Failed to finalize login');
    } finally {
      setBusy(false);
    }
  }

  if (stage === 'select') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-lg space-y-4">
          <h1 className="text-2xl font-semibold text-center">Choose a company</h1>
          <ul className="space-y-3">
            {choices.map(c => (
              <li key={c.tenantId}>
                <button
                  onClick={() => chooseTenant(c)}
                  disabled={busy}
                  className="w-full text-left border rounded p-3 hover:bg-gray-50 disabled:opacity-60"
                >
                  <div className="font-medium">{c.tenantName}</div>
                  <div className="text-xs text-gray-500">Role: {c.role ?? '—'}</div>
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setStage('form')}
            className="text-sm text-gray-600 hover:text-black underline"
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  // Stage: form
return (
  <div className="min-h-screen bg-white">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* LEFT: Login card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_6px_24px_rgba(0,0,0,0.06)] p-6 sm:p-8 lg:p-10">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Sign in</h1>
          <p className="mt-3 text-slate-500 leading-relaxed">
            Sign in to your account and explore a world of possibilities. Your journey begins here.
          </p>

          <form onSubmit={submitCredentials} className="mt-8 space-y-5">
            {/* Email */}
            <label className="block">
              <span className="text-sm font-medium text-slate-800">User name</span>
              <div className="relative mt-2">
                <input
                  type="email"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pl-11 text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Enter user name"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                />
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M4 4h16v16H4z" stroke="none" />
                  <path d="M4 8l8 5l8-5" />
                </svg>
              </div>
            </label>

            {/* Password */}
            <label className="block">
              <span className="text-sm font-medium text-slate-800">Password</span>
              <div className="relative mt-2">
                <input
                  type="password"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pl-11 text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="3" y="11" width="18" height="10" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
            </label>

            {/* Row: Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                Remember me
              </label>
              <button
                type="button"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                Forgot your password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-indigo-600 py-3 text-white text-sm font-semibold shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {busy ? 'Checking…' : 'Sign in'}
            </button>

            {/* Footer link */}
            <p className="text-center text-sm text-slate-600">
              Don&apos;t have an account{' '}
              <a className="font-semibold text-indigo-600 hover:text-indigo-700" href="#">
                Register here
              </a>
            </p>
          </form>
        </div>

        {/* RIGHT: Illustration */}
        <div className="hidden lg:block">
          <div className="relative">
            <img
              src={auth}
              alt="Secure sign-in illustration"
              className="w-full max-w-2xl ml-auto"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

}

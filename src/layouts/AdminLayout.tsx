import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../app/AuthProvider';
import { useTenant } from '../app/TenantProvider';
import { Role } from '../types/schema';
import { getStoredTenantId } from '../services/AxiosInstance';
import {
  Home,
  Users,
  UserPlus,
  CreditCard,
  DollarSign,
  User,
  UserIcon,
} from "lucide-react";

const linkBase =
  'px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition';
const linkActive = 'bg-gray-200';

export default function AdminLayout() {
  const { payload, logout } = useAuth();
  const { tenant } = useTenant();
  const navigate = useNavigate();

  // Roles from memberships (when present)
  const rolesFromMemberships = new Set((payload?.memberships ?? []).map(m => m.role));
  // Fallback to top-level role from the JWT (your admin token has this)
  const topLevelRole = payload?.role;

  const isAdminOrManager =
    rolesFromMemberships.has(Role.ADMIN) ||
    rolesFromMemberships.has(Role.MANAGER) ||
    topLevelRole === Role.ADMIN ||
    topLevelRole === Role.MANAGER;

  function onLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  const tid = getStoredTenantId();
  const companyLabel = tenant?.name ?? payload?.tenantName ?? 'Select a company';
  const businessId = tenant?.businessId ?? '—';

return (
    <div className="min-h-screen bg-neutral-50 text-slate-900">
      {/* Top bar: full-width, fixed */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 shadow-sm" />
            <div>
              <div className="font-semibold tracking-tight">Taxi-Meter Admin</div>
              <div className="text-xs text-slate-500">
                {companyLabel} ({businessId}){tid ? "" : " — no tenant selected"}
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition
                       hover:bg-slate-50 active:scale-[.98]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/40"
          >
            Logout
          </button>
        </div>
      </header>

      {/* LEFT sidebar — dark, DROPS from the top nav */}
      <aside
        className="
          hidden md:flex
          fixed left-0 top-16 bottom-0 w-64
          h-[calc(100vh-4rem)]
          z-40 flex-col bg-slate-900 text-white border-r border-slate-800
        "
      >
        {/* Profile block */}
        <div className="px-5 pt-6 pb-5">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-slate-600 flex items-center justify-center text-white text-base font-semibold ring-2 ring-slate-800">
              {(companyLabel && companyLabel[0]) || "A"}
            </div>
            <div>
              <div className="text-sm font-semibold leading-tight">{companyLabel || "John Doe"}</div>
              <div className="text-[11px] text-slate-400 leading-tight">{businessId || "john@company.com"}</div>
            </div>
          </div>
          <div className="mt-4 h-px w-full bg-slate-700/60" />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 pb-6 space-y-1 overflow-y-auto">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition
               ${isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`
            }
          >
            <Home className="h-5 w-5 shrink-0" />
            Dashboard
          </NavLink>

          {isAdminOrManager && (
            <>
              <div className="mt-4 mb-1 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Drivers
              </div>

              <NavLink
                to="/drivers"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition
                   ${isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`
                }
              >
                <Users className="h-5 w-5 shrink-0" />
                Driver list
              </NavLink>

              <NavLink
                to="/drivers/add"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition
                   ${isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`
                }
              >
                <UserPlus className="h-5 w-5 shrink-0" />
                Add driver
              </NavLink>

              <div className="mt-4 mb-1 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Operations
              </div>

              <NavLink
                to="/transactions"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition
                   ${isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`
                }
              >
                <CreditCard className="h-5 w-5 shrink-0" />
                Transactions
              </NavLink>

              <NavLink
                to="/payments"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition
                   ${isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`
                }
              >
                <DollarSign className="h-5 w-5 shrink-0" />
                Payments
              </NavLink>
            </>
          )}

          <div className="mt-4 mb-1 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Account
          </div>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition
               ${isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`
            }
          >
            <UserIcon className="h-5 w-5 shrink-0" />
            Profile
          </NavLink>
        </nav>
      </aside>

      {/* Mobile nav (optional) sits below the fixed header */}
      <aside className="md:hidden fixed top-16 inset-x-0 border-b border-slate-200 bg-white z-40">
        <div className="mx-auto max-w-7xl px-3 py-2 overflow-x-auto">
          <nav className="flex items-center gap-2">
            <NavLink to="/" end className={({ isActive }) => `rounded-md px-3 py-2 text-sm ${isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
              Dashboard
            </NavLink>
            {isAdminOrManager && (
              <>
                <NavLink to="/drivers" className={({ isActive }) => `rounded-md px-3 py-2 text-sm ${isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
                  Drivers
                </NavLink>
                <NavLink to="/drivers/add" className={({ isActive }) => `rounded-md px-3 py-2 text-sm ${isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
                  Add
                </NavLink>
                <NavLink to="/transactions" className={({ isActive }) => `rounded-md px-3 py-2 text-sm ${isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
                  Transactions
                </NavLink>
                <NavLink to="/payments" className={({ isActive }) => `rounded-md px-3 py-2 text-sm ${isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
                  Payments
                </NavLink>
              </>
            )}
            <NavLink to="/profile" className={({ isActive }) => `rounded-md px-3 py-2 text-sm ${isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
              Profile
            </NavLink>
          </nav>
        </div>
      </aside>

      {/* Content offset for fixed header & sidebar */}
      <main className="pt-16 px-4 sm:px-6 lg:px-8 py-5 md:ml-64">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );

}

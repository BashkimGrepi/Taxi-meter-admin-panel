import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../app/AuthProvider";
import { useTenant } from "../app/TenantProvider";
import { useLogout } from "../hooks/useLogout";
import { useNavigation } from "../hooks/useNavigation";
import { NavigationLink } from "../components/NavigationLink";
import { Bell, Settings, Building2 } from "lucide-react";
import { useTenantSync } from "../hooks/useTenantSync";
import { useEffect } from "react";

const TITLES: Record<string, string> = {
  "/": "Welcome ",
  "/drivers": "Drivers",
  "/transactions": "Transactions",
  "/payments": "Payments",
  "/profile": "Profile",
  "/pricing": "Pricing Policies",
}

export default function AdminLayout() {
  const location = useLocation();
  const { tenant } = useTenant();
  const { handleLogout } = useLogout();
  const { groupedNavItems } = useNavigation();
  const { refreshTenantData } = useTenantSync(); 

  useEffect(() => {
    refreshTenantData();
  }, [refreshTenantData]);
  

  const currentTitle = TITLES[location.pathname] || "/";

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-gray-100 to-slate-160">
      {/* LEFT SIDEBAR - Thin & Integrated */}
      <aside className="flex fixed left-0 top-0 bottom-0 w-20 z-40 flex-col bg-gradient-to-br from-slate-20 via-gray-60 to-slate-100">
        {/* Company info moved to main header area */}

        {/* Navigation - Icon Only */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {/* Render all navigation items as icons only */}
          {groupedNavItems.ungrouped.map((item) => (
            <div key={item.to} className="group relative flex justify-center">
              <NavigationLink
                key={item.to}
                to={item.to}
                icon={item.icon}
                label="" // Hide labels for icon-only view
                end={item.end}
              />
              {/* Enhanced Tooltip */}
              <div className="absolute left-full ml-3 px-3 py-2 bg-slate-900/95 backdrop-blur-sm text-white text-sm font-medium rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 z-50 whitespace-nowrap top-1/2 -translate-y-1/2 shadow-lg border border-slate-700/50">
                {item.label}
                {/* Tooltip Arrow */}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900/95"></div>
              </div>
            </div>
          ))}

          {/* Visual separator for grouped items */}
          {Object.keys(groupedNavItems.groups).length > 0 && (
            <div className="py-6">
              <div className="w-8 h-px bg-white/10 mx-auto"></div>
            </div>
          )}

          {/* Grouped items without section dividers */}
          {Object.entries(groupedNavItems.groups).map(([, items]) =>
            items.map((item) => (
              <div key={item.to} className="group relative flex justify-center">
                <NavigationLink
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label="" // Hide labels for icon-only view
                  end={item.end}
                />
                {/* Enhanced Tooltip */}
                <div className="absolute left-full ml-3 px-3 py-2 bg-slate-900/95 backdrop-blur-sm text-white text-sm font-medium rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 z-50 whitespace-nowrap top-1/2 -translate-y-1/2 shadow-lg border border-slate-700/50">
                  {item.label}
                  {/* Tooltip Arrow */}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900/95"></div>
                </div>
              </div>
            ))
          )}
        </nav>

        {/* User Profile & Logout - Minimalist */}
        <div className="px-3 pb-8 pt-4 border-t border-white/5 space-y-4 mt-auto">
          {/* Logout Button */}
          <div className="group relative flex justify-center">
            <button
              onClick={handleLogout}
              className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/50 hover:bg-red-50/70 text-slate-600 hover:text-red-600 transition-all duration-300 hover:shadow-lg hover:scale-105 border border-slate-200/40 hover:border-red-200/60"
            >
              <svg
                className="h-5 w-5 transition-transform duration-200 group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
            {/* Enhanced Tooltip */}
            <div className="absolute left-full ml-3 px-3 py-2 bg-slate-900/95 backdrop-blur-sm text-white text-sm font-medium rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 z-50 whitespace-nowrap top-1/2 -translate-y-1/2 shadow-lg border border-slate-700/50">
              Sign Out
              {/* Tooltip Arrow */}
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900/95"></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content - Spacious Layout */}
      <main className="ml-20 h-screen overflow-y-auto custom-scrollbar">
        <div className="px-8 py-12">
          <div className="mx-auto max-w-6xl">
            {/* Header Area - Modern Welcome Header */}
            <div className="mb-12">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Left Side - Greeting & User Info */}
                <div className="flex items-center gap-4">
                  {/* Greeting & Company Info */}
                  <div>
                    <p className="font-extralight text-slate-950">
                      Personal Dashboard
                    </p>
                    <h1 className="text-3xl font-sans text-slate-950 mb-1">
                     {currentTitle}
                    </h1>
                    <div className="flex items-center gap-2 text-slate-600 ">
                      {tenant?.name && (
                        <>
                          <Building2 className="h-4 w-4" />
                          <span className="text-sm font-extralight text-slate-950">
                            {tenant.name}
                          </span>
                          {tenant.businessId && (
                            <span className="text-xs text-slate-400">
                              • {tenant.businessId}
                            </span>
                          )}
                        </>
                      )}
                      {!tenant?.name && (
                        <span className="text-sm text-slate-500">
                          Welcome to your dashboard
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side - Action Buttons */}
                <div className="flex items-center gap-3">
                  {/* Notifications Button */}
                  <button className="relative w-11 h-11 rounded-2xl bg-white/70 hover:bg-white border border-slate-200/60 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center group">
                    <Bell className="h-5 w-5 text-slate-600 group-hover:text-slate-900 transition-colors" />
                    {/* Notification Badge */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                  </button>

                  {/* Settings Button */}
                  <button className="w-11 h-11 rounded-2xl bg-white/70 hover:bg-white border border-slate-200/60 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center group">
                    <Settings className="h-5 w-5 text-slate-600 group-hover:text-slate-900 group-hover:rotate-90 transition-all duration-300" />
                  </button>

                  {/* User Menu Button */}
                </div>
              </div>

              {/* Divider */}
              <div className="mt-8 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
            </div>

            {/* Content Area */}
            <div className="space-y-8">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

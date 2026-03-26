import { Outlet } from "react-router-dom";
import { useAuth } from "../app/AuthProvider";
import { useTenant } from "../app/TenantProvider";
import { useLogout } from "../hooks/useLogout";
import { useNavigation } from "../hooks/useNavigation";
import { NavigationLink } from "../components/NavigationLink";
import { Bell, User, Calendar, ChevronDown } from "lucide-react";
import { useTenantSync } from "../hooks/useTenantSync";
import { useState } from "react";
import logo from "../assets/images/logo_black.png";

export default function AdminLayout() {
  const { tenant } = useTenant();
  const { user, payload } = useAuth();
  const { handleLogout } = useLogout();
  const { groupedNavItems } = useNavigation();
  useTenantSync();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Period selection state
  type PeriodOption = "all_time" | "this_month" | "today";
  const [selectedPeriod, setSelectedPeriod] =
    useState<PeriodOption>("all_time");

  const getPeriodLabel = (period: PeriodOption) => {
    switch (period) {
      case "all_time":
        return "All Time";
      case "this_month":
        return "This Month";
      case "today":
        return "Today";
    }
  };

  const handlePeriodChange = (period: PeriodOption) => {
    setSelectedPeriod(period);
    setShowDatePicker(false);
  };

  return (
    <div className="h-screen overflow-hidden relative bg-gradient-to-br from-slate-20 via-gray-60 to-slate-100 to-slate-160">
      {/* TOP NAVIGATION BAR */}
      <header className="fixed top-0 right-0 left-20 z-30 bg-gradient-to-br from-slate-20 via-gray-60 to-slate-100 border-b border-slate-200/50">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo */}
            <div className="flex items-center gap-6">
              <img src={logo} alt="TXMeter" className="h-8" />
            </div>

            {/* Right: System Status + Actions + Profile */}
            <div className="flex items-center gap-6">
              {/* Period Picker */}
              <div className="relative">
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors duration-200 text-white shadow-lg"
                >
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {getPeriodLabel(selectedPeriod)}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Period Options Dropdown */}
                {showDatePicker && (
                  <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 w-48 z-50">
                    <button
                      onClick={() => handlePeriodChange("today")}
                      className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors duration-150 ${
                        selectedPeriod === "today"
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => handlePeriodChange("this_month")}
                      className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors duration-150 ${
                        selectedPeriod === "this_month"
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      This Month
                    </button>
                    <button
                      onClick={() => handlePeriodChange("all_time")}
                      className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors duration-150 ${
                        selectedPeriod === "all_time"
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      All Time
                    </button>
                  </div>
                )}
              </div>

              {/* System Status */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50/80 border border-emerald-200/60">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-sm font-medium text-emerald-700">
                  System: Healthy
                </span>
              </div>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2.5 rounded-xl hover:bg-slate-100 transition-colors duration-200 text-slate-600 hover:text-slate-900"
                >
                  <Bell className="w-5 h-5" />
                  {/* Notification Badge */}
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-800">
                    {user?.username || payload?.email || "Admin User"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {tenant?.name || "Administrator"}
                  </p>
                </div>
                <button className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-semibold shadow-lg hover:scale-105 transition-transform duration-200">
                  <User className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

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
            )),
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
      <main className="ml-20 h-screen overflow-y-auto custom-scrollbar pt-20 bg-gradient-to-br from-slate-100 via-gray-60 to-slate-20 to-slate-160">
        <div className="px-8 py-8">
          <div className="mx-auto ">
            {/* Content Area */}
            <div>
              <Outlet context={{ selectedPeriod, setSelectedPeriod }} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

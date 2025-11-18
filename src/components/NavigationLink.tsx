import { NavLink } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface NavigationLinkProps {
  to: string;
  icon: LucideIcon;
  label: string;
  end?: boolean;
}

const NAV_LINK_STYLES = {
  base: "group flex items-center justify-center w-11 h-11 rounded-2xl text-sm font-light transition-all duration-300 hover:scale-105 active:scale-95",
  active:
    "bg-gradient-to-r from-gray-700 to-gray-950 text-white shadow-lg shadow-gray-500/70 scale-125",
  inactive:
    "text-slate-600 hover:bg-white/60 hover:text-slate-900 border border-slate-200/40 hover:border-slate-300/60 hover:shadow-md",
} as const;

export const NavigationLink = ({
  to,
  icon: Icon,
  label,
  end = false,
}: NavigationLinkProps) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `${NAV_LINK_STYLES.base} ${
        isActive ? NAV_LINK_STYLES.active : NAV_LINK_STYLES.inactive
      }`
    }
  >
    <Icon className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
    {label && <span className="ml-2">{label}</span>}
  </NavLink>
);

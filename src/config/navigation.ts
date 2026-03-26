import {
  Home,
  Users,
  CreditCard,
  DollarSign,
  UserIcon,
  ParkingMeter,
  Car,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface NavigationItem {
  to: string;
  icon: LucideIcon;
  label: string;
  end?: boolean;
  section?: string;
  adminOnly?: boolean;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    to: "/",
    icon: Home,
    label: "Dashboard",
    end: true,
  },
  {
    to: "/rides",
    icon: Car,
    label: "Rides",
    section: "Operations",
    adminOnly: true,
  },

  {
    to: "/drivers",
    icon: Users,
    label: "Driver List",
    section: "Driver Management",
    adminOnly: true,
  },
  {
    to: "/transactions",
    icon: CreditCard,
    label: "Payments & Transactions",
    section: "Financial Operations",
    adminOnly: true,
  },
  {
    to: "/payments",
    icon: DollarSign,
    label: "Payments",
    section: "Financial Operations",
    adminOnly: true,
  },
  {
    to: "/pricing",
    icon: ParkingMeter,
    label: "Pricing Policies",
    section: "Financial Operations",
    adminOnly: true,
  },
  {
    to: "/profile",
    icon: UserIcon,
    label: "Profile",
    section: "Account",
  },
];

export const LAYOUT_CONSTANTS = {
  SIDEBAR_WIDTH: "w-72",
  MAIN_MARGIN: "ml-72",
} as const;

export const LAYOUT_STYLES = {
  GRADIENT_PRIMARY: "from-indigo-500 to-purple-600",
  GRADIENT_BACKGROUND: "from-slate-50 via-white to-slate-100",
} as const;

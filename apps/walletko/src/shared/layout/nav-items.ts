import {
  ArrowUpDown,
  BookOpen,
  LayoutDashboard,
  Tag,
  Wallet,
} from "lucide-react";

const primaryNavItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/pots", label: "Pots", icon: Wallet },
  { to: "/transactions", label: "Transactions", icon: ArrowUpDown },
] as const;

const secondaryNavItems = [
  { to: "/tags", label: "Tags", icon: Tag },
  { to: "/views/", label: "Views", icon: BookOpen },
] as const;

export { primaryNavItems, secondaryNavItems };
export const navItems = [...primaryNavItems, ...secondaryNavItems];

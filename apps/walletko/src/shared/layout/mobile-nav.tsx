import { Link } from "@tanstack/react-router";
import { MobileAccountTab } from "src/shared/layout/mobile-account-tab";
import {
  mobileTabClass,
  tabIndicatorClass,
} from "src/shared/layout/mobile-tab-styles";
import { primaryNavItems } from "src/shared/layout/nav-items";
import { cn } from "src/shared/lib/utils";

export function MobileTabLink({
  to,
  label,
  icon: Icon,
}: {
  to: string;
  label: string;
  icon: React.ElementType;
}) {
  return (
    <Link
      to={to}
      className={cn(
        mobileTabClass,
        tabIndicatorClass,
        "text-muted-foreground [&.active]:text-primary [&.active]:before:opacity-100",
      )}
    >
      <Icon className="size-5" />
      <span>{label}</span>
    </Link>
  );
}

export function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur-sm lg:hidden">
      <div className="flex items-stretch pb-safe">
        {primaryNavItems.map(({ to, label, icon }) => (
          <MobileTabLink key={to} to={to} label={label} icon={icon} />
        ))}
        <MobileAccountTab />
      </div>
    </nav>
  );
}

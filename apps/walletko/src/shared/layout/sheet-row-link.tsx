import { Link } from "@tanstack/react-router";
import { SheetClose } from "src/shared/ui/sheet";

export function SheetRowLink({
  to,
  label,
  icon: Icon,
}: {
  to: string;
  label: string;
  icon: React.ElementType;
}) {
  return (
    <SheetClose
      render={
        <Link
          to={to}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent [&.active]:bg-accent [&.active]:text-accent-foreground"
        >
          <Icon className="size-[18px] shrink-0 text-muted-foreground" />
          <span className="truncate">{label}</span>
        </Link>
      }
    />
  );
}

import { MoreVerticalIcon } from "lucide-react";
import { cn } from "src/shared/lib/utils";
import { Button, buttonVariants } from "src/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "src/shared/ui/dropdown-menu";
import { type ActionItem, PageFab } from "src/shared/ui/page-fab";

type PrimaryAction = ActionItem & { items?: ActionItem[] };

type PageActionsProps = {
  primary: PrimaryAction;
  secondary?: ActionItem[];
  mode?: "fab" | "overflow";
};

function DesktopCluster({
  primary,
  secondary,
  primaryFirst = false,
}: {
  primary: PrimaryAction;
  secondary: ActionItem[];
  primaryFirst?: boolean;
}) {
  const secondaryButtons = secondary.map((a) => (
    <Button
      key={a.key}
      variant={a.variant ?? "outline"}
      disabled={a.disabled}
      onClick={a.onClick}
      className="gap-2 cursor-pointer"
    >
      {a.icon}
      {a.label}
    </Button>
  ));

  const primaryButton = primary.items ? (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(buttonVariants(), "gap-2 cursor-pointer")}
      >
        {primary.icon}
        {primary.label}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {primary.items.map((item) => (
          <DropdownMenuItem
            key={item.key}
            disabled={item.disabled}
            className="gap-2 cursor-pointer"
            onClick={item.onClick}
          >
            {item.icon}
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Button
      variant={primary.variant ?? "default"}
      disabled={primary.disabled}
      onClick={primary.onClick}
      className="gap-2 cursor-pointer"
    >
      {primary.icon}
      {primary.label}
    </Button>
  );

  return (
    <div className="hidden lg:flex items-center gap-2">
      {primaryFirst ? (
        <>
          {primaryButton}
          {secondaryButtons}
        </>
      ) : (
        <>
          {secondaryButtons}
          {primaryButton}
        </>
      )}
    </div>
  );
}

function MobileOverflow({ items }: { items: ActionItem[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "cursor-pointer",
        )}
        aria-label="More actions"
      >
        <MoreVerticalIcon className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {items.map((a) => (
          <DropdownMenuItem
            key={a.key}
            disabled={a.disabled}
            variant={a.variant === "destructive" ? "destructive" : "default"}
            className="gap-2 cursor-pointer"
            onClick={a.onClick}
          >
            {a.icon}
            {a.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function PageActions({
  primary,
  secondary = [],
  mode = "fab",
}: PageActionsProps) {
  if (mode === "overflow") {
    const { items: _items, ...primaryBase } = primary;
    const allMobile: ActionItem[] = [primaryBase, ...secondary];
    return (
      <>
        <DesktopCluster primary={primary} secondary={secondary} primaryFirst />
        <div className="lg:hidden">
          <MobileOverflow items={allMobile} />
        </div>
      </>
    );
  }

  return (
    <>
      <DesktopCluster primary={primary} secondary={secondary} />
      {secondary.length > 0 && (
        <div className="lg:hidden">
          <MobileOverflow items={secondary} />
        </div>
      )}
      <PageFab
        icon={primary.icon}
        label={primary.label}
        onClick={primary.items ? undefined : primary.onClick}
        items={primary.items}
        disabled={primary.disabled}
      />
    </>
  );
}

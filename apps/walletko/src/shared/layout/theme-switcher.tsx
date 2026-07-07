import { Monitor, Moon, Sun } from "lucide-react";
import { type ThemeMode, useThemeMode } from "src/shared/hooks/use-theme-mode";
import { cn } from "src/shared/lib/utils";
import { Button } from "src/shared/ui/button";
import { ButtonGroup } from "src/shared/ui/button-group";
import { Popover, PopoverContent, PopoverTrigger } from "src/shared/ui/popover";

const THEME_OPTIONS: {
  mode: ThemeMode;
  icon: React.ElementType;
  label: string;
}[] = [
  { mode: "light", icon: Sun, label: "Light" },
  { mode: "auto", icon: Monitor, label: "System" },
  { mode: "dark", icon: Moon, label: "Dark" },
];

function ThemeButtons({
  mode,
  onSelect,
}: {
  mode: ThemeMode;
  onSelect: (mode: ThemeMode) => void;
}) {
  return (
    <ButtonGroup role="radiogroup" aria-label="Theme">
      {THEME_OPTIONS.map(({ mode: optionMode, icon: Icon, label }) => {
        const active = mode === optionMode;
        return (
          <Button
            key={optionMode}
            type="button"
            variant="outline"
            size="icon-sm"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => onSelect(optionMode)}
            className={cn(
              "border-sidebar-border bg-sidebar text-sidebar-foreground/45 hover:bg-sidebar-accent hover:text-sidebar-foreground/80 dark:border-sidebar-border dark:bg-sidebar dark:hover:bg-sidebar-accent",
              active &&
                "z-10 bg-sidebar-accent text-sidebar-primary hover:bg-sidebar-accent hover:text-sidebar-primary dark:bg-sidebar-accent dark:hover:bg-sidebar-accent",
            )}
          >
            <Icon className="size-3.5" />
          </Button>
        );
      })}
    </ButtonGroup>
  );
}

export function ThemeSwitcher({ collapsed }: { collapsed: boolean }) {
  const { mode, select } = useThemeMode();

  if (collapsed) {
    const current = THEME_OPTIONS.find((option) => option.mode === mode);
    const CurrentIcon = current?.icon ?? Monitor;

    return (
      <Popover>
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Theme: ${current?.label ?? "System"}`}
              className="text-sidebar-foreground/55 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <CurrentIcon className="size-3.5" />
            </Button>
          }
        />
        <PopoverContent
          side="right"
          sideOffset={12}
          className="flex w-auto justify-between items-center gap-3 p-2"
        >
          <span className="text-xs font-medium text-muted-foreground">
            Theme
          </span>
          <ThemeButtons mode={mode} onSelect={select} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div className="flex w-full items-center justify-between gap-2 px-2 py-1">
      <span className="text-xs font-medium text-sidebar-foreground/50">
        Theme
      </span>
      <ThemeButtons mode={mode} onSelect={select} />
    </div>
  );
}

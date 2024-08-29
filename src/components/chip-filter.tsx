import { LucideIcon, X } from "lucide-react";
import { Badge } from "./ui/badge";

export function ChipFilter({
  ClearIcon,
  title,
  value,
  onClear,
}: ChipFilterProps) {
  const Icon = ClearIcon ? ClearIcon : X;

  return (
    <Badge variant={"secondary"} className="h-[40px] px-4 gap-1">
      <span className="text-muted-foreground">{title} : </span>
      <span>{value}</span>
      <button
        className="ml-1"
        onClick={() => onClear()}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onClear();
          }
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Icon className="h-3 w-3 text-muted-foreground hover:text-foreground" />
      </button>
    </Badge>
  );
}

type ChipFilterProps = {
  title: string;
  value: string;
  onClear: () => void;
  ClearIcon?: LucideIcon;
};

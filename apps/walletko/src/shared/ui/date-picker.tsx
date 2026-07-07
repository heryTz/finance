import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Calendar } from "src/shared/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "src/shared/ui/popover";

type DatePickerProps = {
  value: Date;
  onChange: (date: Date) => void;
};

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        className="flex h-9 w-full items-center gap-2 rounded-lg border border-input bg-transparent px-3 py-1 text-sm transition-colors outline-none dark:bg-input/30 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        aria-label="Pick a date"
      >
        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        <span>{formatDate(value)}</span>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            if (date !== undefined) {
              onChange(date);
              setOpen(false);
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

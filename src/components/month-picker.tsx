import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarDaysIcon } from "lucide-react";
import { humanMonthDate } from "@/lib/humanizer";
import { ComponentProps } from "react";
import { MonthPickerContent } from "./month-picker-content";

export function MonthPicker({
  placeholder,
  value,
  onChange,
  buttonProps,
  type,
}: MonthPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          {...buttonProps}
          className={cn(
            "flex justify-start w-full pl-3 text-left font-normal aria-invalid:border-destructive aria-invalid:text-destructive",
            !value && "text-muted-foreground",
            buttonProps?.className,
          )}
          StartIcon={CalendarDaysIcon}
        >
          {!value && <span>{placeholder ?? "Prend une date"}</span>}
          {value && type === "simple" && humanMonthDate(value)}
          {value && type === "range" && value.from ? (
            value.to ? (
              <>
                {humanMonthDate(value.from)} - {humanMonthDate(value.to)}
              </>
            ) : (
              humanMonthDate(value.from)
            )
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {/* WTF! to satify TypeScript */}
        {type === "simple" ? (
          <MonthPickerContent type={type} value={value} onChange={onChange} />
        ) : (
          <MonthPickerContent type={type} value={value} onChange={onChange} />
        )}
      </PopoverContent>
    </Popover>
  );
}

type MonthPickerProps = {
  placeholder?: string;
  buttonProps?: ComponentProps<typeof Button>;
} & ComponentProps<typeof MonthPickerContent>;

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
}: MonthPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "flex justify-start w-full pl-3 text-left font-normal aria-[invalid=true]:border-destructive aria-[invalid=true]:text-destructive",
            !value && "text-muted-foreground",
          )}
          StartIcon={CalendarDaysIcon}
          {...buttonProps}
        >
          {value?.from ? (
            value.to ? (
              <>
                {humanMonthDate(value.from)} - {humanMonthDate(value.to)}
              </>
            ) : (
              humanMonthDate(value.from)
            )
          ) : (
            <span>{placeholder ?? "Prend une date"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <MonthPickerContent value={value} onChange={onChange} />
      </PopoverContent>
    </Popover>
  );
}

type MonthPickerProps = {
  placeholder?: string;
  buttonProps?: ComponentProps<typeof Button>;
} & ComponentProps<typeof MonthPickerContent>;

import { FormControl, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { humanDate } from "@/lib/humanizer";
import { CalendarDaysIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

export const CalendarRangeField = ({
  ref,
  placeholder,
  value,
  label,
  onChange,
  error,
}: CalendarRangeFieldProps & {
  ref?: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <FormItem ref={ref}>
      <FormLabel>{label}</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant={"outline"}
              className={cn(
                "flex justify-start w-full pl-3 text-left font-normal aria-invalid:border-destructive aria-invalid:text-destructive",
                !value && "text-muted-foreground",
              )}
              StartIcon={CalendarDaysIcon}
            >
              {value?.from ? (
                value.to ? (
                  <>
                    {humanDate(value.from)} - {humanDate(value.to)}
                  </>
                ) : (
                  humanDate(value.from)
                )
              ) : (
                <span>{placeholder ?? "Prend une date"}</span>
              )}
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={value}
            onSelect={onChange}
          />
        </PopoverContent>
      </Popover>
      <FormMessage>
        {error?.to?.message ?? error?.from?.message ?? null}
      </FormMessage>
    </FormItem>
  );
};

CalendarRangeField.displayName = "CalendarRangeField";

type CalendarRangeFieldProps = {
  placeholder?: string;
  label: string;
  value?: DateRange;
  onChange: (value?: DateRange) => void;
  error?: Merge<FieldError, FieldErrorsImpl<DateRange>>;
};

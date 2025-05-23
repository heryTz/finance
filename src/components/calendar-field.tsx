import { FormControl, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { humanDate } from "@/lib/humanizer";
import { CalendarDaysIcon } from "lucide-react";

export const CalendarField = ({
  ref,
  placeholder,
  value,
  label,
  onChange,
}: CalendarFieldProps & {
  ref?: React.RefObject<HTMLButtonElement> | React.RefObject<HTMLButtonElement>;
}) => {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              ref={ref}
              variant={"outline"}
              className={cn(
                "flex justify-start w-full pl-3 text-left font-normal aria-invalid:border-destructive aria-invalid:text-destructive",
                !value && "text-muted-foreground",
              )}
              StartIcon={CalendarDaysIcon}
            >
              {value ? (
                humanDate(value)
              ) : (
                <span>{placeholder ?? "Prend une date"}</span>
              )}
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={value} onSelect={onChange} />
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
};

CalendarField.displayName = "CalendarField";

type CalendarFieldProps = {
  placeholder?: string;
  label: string;
  value?: Date;
  onChange: (value?: Date) => void;
};

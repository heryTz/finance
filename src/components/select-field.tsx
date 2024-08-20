import { forwardRef } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { FormControl, FormItem, FormLabel, FormMessage } from "./ui/form";

export const SelectField = forwardRef<HTMLDivElement, SelectFieldProps>(
  ({ placeholder, value, label, onChange, options }, ref) => {
    return (
      <FormItem ref={ref}>
        <FormLabel>{label}</FormLabel>
        <Select value={value} onValueChange={onChange}>
          <FormControl>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={placeholder ?? "Sélectionner une option"}
              />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectGroup>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    );
  },
);

SelectField.displayName = "SelectField";

type SelectFieldProps = {
  placeholder?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
};

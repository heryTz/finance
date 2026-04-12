import { ComponentProps } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function AppSelect({
  placeholder,
  value,
  triggerProps,
  onChange,
  options,
}: AppSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full" {...triggerProps}>
        <SelectValue placeholder={placeholder ?? "Sélectionner une option"} />
      </SelectTrigger>
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
  );
}

type AppSelectProps = {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  triggerProps?: ComponentProps<typeof SelectTrigger>;
};

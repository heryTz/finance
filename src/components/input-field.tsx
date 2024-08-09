import { forwardRef } from "react";
import { FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

export const InputField = forwardRef<HTMLDivElement, InputFieldProps>(
  ({ label, ...props }, ref) => {
    return (
      <FormItem ref={ref}>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input {...props} />
        </FormControl>
        <FormMessage />
      </FormItem>
    );
  },
);

InputField.displayName = "InputField";

type InputFieldProps = {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

import { ComponentProps, forwardRef } from "react";
import {
  FormControlWithArea,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { AppSelect } from "./app-select";

export const SelectField = forwardRef<HTMLDivElement, SelectFieldProps>(
  ({ label, triggerProps, ...props }, ref) => {
    return (
      <FormItem ref={ref}>
        <FormLabel>{label}</FormLabel>
        <FormControlWithArea
          component={(area) => (
            <AppSelect {...props} triggerProps={{ ...area, ...triggerProps }} />
          )}
        />
        <FormMessage />
      </FormItem>
    );
  },
);

SelectField.displayName = "SelectField";

type SelectFieldProps = {
  label: string;
} & ComponentProps<typeof AppSelect>;

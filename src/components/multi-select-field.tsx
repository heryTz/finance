import { ComponentProps, forwardRef } from "react";
import {
  FormControlWithArea,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { MultiSelect } from "./multi-select";

export const MultiSelectField = forwardRef<
  HTMLDivElement,
  MultiSelectFieldProps
>(({ label, ...props }, ref) => {
  return (
    <FormItem ref={ref}>
      <FormLabel>{label}</FormLabel>
      <FormControlWithArea
        component={(area) => <MultiSelect {...props} inputProps={area} />}
      />
      <FormMessage />
    </FormItem>
  );
});

MultiSelectField.displayName = "MultiSelectField";

type MultiSelectFieldProps = {
  label: string;
} & ComponentProps<typeof MultiSelect>;

import { forwardRef, PropsWithChildren } from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "./ui/form";

export const Field = forwardRef<HTMLDivElement, FieldProps>(
  ({ label, children }, ref) => {
    return (
      <FormItem ref={ref}>
        <FormLabel>{label}</FormLabel>
        <FormControl>{children}</FormControl>
        <FormMessage />
      </FormItem>
    );
  },
);

Field.displayName = "Field";

type FieldProps = PropsWithChildren<{
  label: string;
}>;

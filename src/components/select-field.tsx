import { ComponentProps } from "react";
import {
  FormControlWithArea,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { AppSelect } from "./app-select";

export const SelectField = ({
  ref,
  label,
  triggerProps,
  ...props
}: SelectFieldProps & {
  ref?: React.RefObject<HTMLDivElement>;
}) => {
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
};

SelectField.displayName = "SelectField";

type SelectFieldProps = {
  label: string;
} & ComponentProps<typeof AppSelect>;

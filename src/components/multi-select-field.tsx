import { ComponentProps } from "react";
import {
  FormControlWithArea,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { MultiSelect } from "./multi-select";

export const MultiSelectField = ({
  ref,
  label,
  inputProps,
  ...props
}: MultiSelectFieldProps & {
  ref?: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <FormItem ref={ref}>
      <FormLabel>{label}</FormLabel>
      <FormControlWithArea
        component={(area) => (
          <MultiSelect {...props} inputProps={{ ...inputProps, ...area }} />
        )}
      />
      <FormMessage />
    </FormItem>
  );
};

MultiSelectField.displayName = "MultiSelectField";

type MultiSelectFieldProps = {
  label: string;
} & ComponentProps<typeof MultiSelect>;

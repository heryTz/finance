import { ComponentProps } from "react";
import {
  FormControlWithArea,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { MonthPicker } from "./month-picker";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import { MonthRange } from "./month-picker-content";

export const MonthPickerField = ({
  ref,
  label,
  error,
  ...props
}: MonthPickerFieldProps & {
  ref?: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <FormItem ref={ref}>
      <FormLabel>{label}</FormLabel>
      <FormControlWithArea
        component={(aria) => <MonthPicker {...aria} {...props} />}
      />
      <FormMessage>
        {error?.to?.message ?? error?.from?.message ?? null}
      </FormMessage>
    </FormItem>
  );
};

MonthPickerField.displayName = "MonthPickerField";

type MonthPickerFieldProps = {
  label: string;
  error?: Merge<FieldError, FieldErrorsImpl<MonthRange>>;
} & ComponentProps<typeof MonthPicker>;

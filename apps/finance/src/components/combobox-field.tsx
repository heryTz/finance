import { ComponentProps } from "react";
import {
  FormControlWithArea,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Combobox } from "./ui/combobox";

export const ComboboxField = ({
  ref,
  label,
  formItemProps,
  buttonProps,
  ...props
}: ComboboxFieldProps & {
  ref?: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <FormItem ref={ref} {...formItemProps}>
      <FormLabel>{label}</FormLabel>
      <FormControlWithArea
        component={(area) => (
          <Combobox {...props} buttonProps={{ ...buttonProps, ...area }} />
        )}
      />
      <FormMessage />
    </FormItem>
  );
};

ComboboxField.displayName = "ComboboxField";

type ComboboxFieldProps = {
  label: string;
  formItemProps?: ComponentProps<typeof FormItem>;
} & ComponentProps<typeof Combobox>;

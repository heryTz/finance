import { ComponentProps } from "react";
import {
  FormControlWithArea,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Autocomplete } from "./autocomplete";

export const AutocompleteField = ({
  ref,
  label,
  formItemProps,
  inputProps,
  ...props
}: AutocompleteFieldProps & {
  ref?: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <FormItem ref={ref} {...formItemProps}>
      <FormLabel>{label}</FormLabel>
      <FormControlWithArea
        component={(area) => (
          <Autocomplete {...props} inputProps={{ ...inputProps, ...area }} />
        )}
      />
      <FormMessage />
    </FormItem>
  );
};

AutocompleteField.displayName = "AutocompleteField";

type AutocompleteFieldProps = {
  label: string;
  formItemProps?: ComponentProps<typeof FormItem>;
} & ComponentProps<typeof Autocomplete>;

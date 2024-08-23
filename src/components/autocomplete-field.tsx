import { ComponentProps, forwardRef } from "react";
import {
  FormControlWithArea,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Autocomplete } from "./autocomplete";

export const AutocompleteField = forwardRef<
  HTMLDivElement,
  AutocompleteFieldProps
>(({ label, formItemProps, ...props }, ref) => {
  return (
    <FormItem ref={ref} {...formItemProps}>
      <FormLabel>{label}</FormLabel>
      <FormControlWithArea
        component={(area) => <Autocomplete {...props} inputProps={area} />}
      />
      <FormMessage />
    </FormItem>
  );
});

AutocompleteField.displayName = "AutocompleteField";

type AutocompleteFieldProps = {
  label: string;
  formItemProps?: ComponentProps<typeof FormItem>;
} & ComponentProps<typeof Autocomplete>;

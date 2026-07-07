import type { ComponentProps } from "react";
import { useFieldContext } from "src/shared/form/form-setup";
import { Combobox, type ComboboxOption } from "src/shared/ui/combobox";
import { FormField } from "src/shared/ui/form-field";

type ComboboxFieldProps = {
  label: string;
} & Omit<ComponentProps<typeof Combobox>, "value" | "onChange">;

export function ComboboxField({ label, ...comboboxProps }: ComboboxFieldProps) {
  const field = useFieldContext<ComboboxOption[]>();

  return (
    <FormField label={label}>
      <Combobox
        {...comboboxProps}
        value={field.state.value}
        onChange={(items) => field.handleChange(items)}
      />
    </FormField>
  );
}

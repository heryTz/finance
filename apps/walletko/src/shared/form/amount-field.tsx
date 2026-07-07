import type { ComponentProps } from "react";
import { useFieldContext } from "src/shared/form/form-setup";
import { useFormatError } from "src/shared/lib/use-format-error";
import { FormField } from "src/shared/ui/form-field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "src/shared/ui/input-group";

type AmountFieldProps = {
  label: string;
  currency?: string;
} & Omit<ComponentProps<"input">, "type" | "value" | "onChange" | "onBlur">;

export function AmountField({
  label,
  currency = "$",
  ...inputProps
}: AmountFieldProps) {
  const field = useFieldContext<number>();
  const formatError = useFormatError();
  const error = field.state.meta.isValid
    ? undefined
    : formatError(field.state.meta.errors);

  return (
    <FormField label={label} error={error}>
      <InputGroup>
        <InputGroupAddon>{currency}</InputGroupAddon>
        <InputGroupInput
          {...inputProps}
          id={field.name}
          type="number"
          min="0.01"
          step="0.01"
          placeholder="0.00"
          value={field.state.value === 0 ? "" : String(field.state.value)}
          onChange={(e) =>
            field.handleChange(
              e.target.value === "" ? 0 : parseFloat(e.target.value),
            )
          }
          onBlur={field.handleBlur}
          aria-invalid={!!error || undefined}
        />
      </InputGroup>
    </FormField>
  );
}

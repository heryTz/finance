import type { ComponentProps } from "react";
import { useFieldContext } from "src/shared/form/form-setup";
import { useFormatError } from "src/shared/lib/use-format-error";
import { FormField } from "src/shared/ui/form-field";
import { Input } from "src/shared/ui/input";

type InputFieldProps = ComponentProps<typeof Input> & { label: string };

export function InputField({ label, ...inputProps }: InputFieldProps) {
  const field = useFieldContext<string>();
  const formatError = useFormatError();
  const error = field.state.meta.isValid
    ? undefined
    : formatError(field.state.meta.errors);

  return (
    <FormField label={label} error={error}>
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={!!error}
        {...inputProps}
      />
    </FormField>
  );
}

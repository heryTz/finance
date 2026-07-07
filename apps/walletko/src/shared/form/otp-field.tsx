import { useFieldContext } from "src/shared/form/form-setup";
import { useFormatError } from "src/shared/lib/use-format-error";
import { FormField } from "src/shared/ui/form-field";
import { OtpInput } from "src/shared/ui/otp-input";

type OtpFieldProps = {
  label: string;
  disabled?: boolean;
  serverError?: string | null;
};

export function OtpField({ label, disabled, serverError }: OtpFieldProps) {
  const field = useFieldContext<string>();
  const formatError = useFormatError();
  const fieldError = field.state.meta.isValid
    ? undefined
    : formatError(field.state.meta.errors);
  const error = serverError ?? fieldError;

  return (
    <FormField label={label} error={error ?? undefined}>
      <OtpInput
        value={field.state.value}
        onChange={field.handleChange}
        disabled={disabled}
        error={!!error}
      />
    </FormField>
  );
}

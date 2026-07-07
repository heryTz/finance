import { useFieldContext } from "src/shared/form/form-setup";
import { FormField } from "src/shared/ui/form-field";

type ColorFieldProps = { label: string };

export function ColorField({ label }: ColorFieldProps) {
  const field = useFieldContext<string>();
  return (
    <FormField label={label}>
      <input
        type="color"
        id={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        className="h-10 w-full cursor-pointer rounded-md border border-input bg-background px-3"
      />
    </FormField>
  );
}

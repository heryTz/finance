import { useFieldContext } from "src/shared/form/form-setup";
import { DatePicker } from "src/shared/ui/date-picker";
import { FormField } from "src/shared/ui/form-field";

type DatePickerFieldProps = {
  label: string;
};

export function DatePickerField({ label }: DatePickerFieldProps) {
  const field = useFieldContext<Date>();

  return (
    <FormField label={label}>
      <DatePicker
        value={field.state.value}
        onChange={(date) => field.handleChange(date)}
      />
    </FormField>
  );
}

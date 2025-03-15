import { FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

export const InputField = ({
  ref,
  label,
  ...props
}: InputFieldProps & {
  ref: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <FormItem ref={ref}>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input {...props} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

InputField.displayName = "InputField";

type InputFieldProps = {
  label: string;
} & React.ComponentProps<typeof Input>;

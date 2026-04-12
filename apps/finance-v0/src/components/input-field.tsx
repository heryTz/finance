import { FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

export const InputField = ({ label, ...props }: InputFieldProps) => {
  return (
    <FormItem>
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

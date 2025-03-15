import { FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { Textarea } from "./ui/textarea";

export const TextareaField = ({
  ref,
  label,
  ...props
}: TextareaFieldProps & {
  ref: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <FormItem ref={ref}>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Textarea {...props} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

TextareaField.displayName = "TextareaField";

type TextareaFieldProps = {
  label: string;
} & React.ComponentProps<typeof Textarea>;

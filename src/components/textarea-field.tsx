import { forwardRef } from "react";
import { FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { Textarea } from "./ui/textarea";

export const TextareaField = forwardRef<HTMLDivElement, TextareaFieldProps>(
  ({ label, ...props }, ref) => {
    return (
      <FormItem ref={ref}>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Textarea {...props} />
        </FormControl>
        <FormMessage />
      </FormItem>
    );
  },
);

TextareaField.displayName = "TextareaField";

type TextareaFieldProps = {
  label: string;
} & React.ComponentProps<typeof Textarea>;

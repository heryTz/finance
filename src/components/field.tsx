import { ComponentProps, forwardRef, PropsWithChildren } from "react";
import {
  FormControl,
  FormControlWithArea,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

export const Field = forwardRef<HTMLDivElement, FieldProps>(
  ({ label, children, component }, ref) => {
    return (
      <FormItem ref={ref}>
        <FormLabel>{label}</FormLabel>
        {component && <FormControlWithArea component={component} />}
        {children && <FormControl>{children}</FormControl>}
        <FormMessage />
      </FormItem>
    );
  },
);

Field.displayName = "Field";

type FieldProps = PropsWithChildren<{
  label: string;
}> &
  Partial<ComponentProps<typeof FormControlWithArea>>;

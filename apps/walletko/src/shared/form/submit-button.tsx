import type { ComponentProps } from "react";
import { useFormContext } from "src/shared/form/form-setup";
import { cn } from "src/shared/lib/utils";
import { Button } from "src/shared/ui/button";
import { Spinner } from "src/shared/ui/spinner";

type SubmitButtonProps = ComponentProps<typeof Button> & {
  isLoading?: boolean;
};

export function SubmitButton({
  children,
  isLoading,
  disabled,
  className,
  ...props
}: SubmitButtonProps) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(s) => s.isSubmitting}>
      {(isSubmitting) => {
        const loading = isSubmitting || isLoading;
        return (
          <Button
            type="submit"
            {...props}
            className={cn("relative", className)}
            disabled={loading || disabled}
          >
            {loading && (
              <span className="absolute inset-0 flex items-center justify-center">
                <Spinner />
              </span>
            )}
            <span className={cn(loading && "opacity-50")}>{children}</span>
          </Button>
        );
      }}
    </form.Subscribe>
  );
}

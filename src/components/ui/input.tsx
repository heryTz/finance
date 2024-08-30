import * as React from "react";

import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import { Button } from "./button";

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value"
> & {
  value?: React.ComponentPropsWithoutRef<"input">["value"] | null;
  onClear?: () => void;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onClear, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            "aria-[invalid=true]:border-destructive aria-[invalid=true]:text-destructive",
            className,
          )}
          ref={ref}
          {...props}
          // This make input always controlled
          value={props.value ?? ""}
        />
        {onClear && !!props.value && (
          <Button
            variant={"ghost"}
            className="absolute right-2 top-[10px] p-1 h-5 w-5 rounded-full text-muted-foreground"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClear();
            }}
          >
            <XIcon className="w-4 h-4" />
          </Button>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };

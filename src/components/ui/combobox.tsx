"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Combobox({
  placeholder,
  searchPlaceholder,
  options,
  value,
  onChange,
  buttonProps,
  actions,
  emptySearchMessage,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          {...buttonProps}
          className={cn(
            "w-full justify-between font-normal ",
            { "text-muted-foreground": !value },
            buttonProps?.className,
          )}
        >
          {value
            ? options.find((el) => el.value === value)?.label ?? ""
            : placeholder ?? "Sélectionner une option"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-auto" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder ?? "Chercher..."} />
          <CommandList>
            <div className="max-h-[300px] flex flex-col w-full">
              <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <CommandEmpty>
                  {emptySearchMessage ?? "Aucun résultat"}
                </CommandEmpty>
                <CommandGroup>
                  {options.map((el) => (
                    <CommandItem
                      key={el.value}
                      value={el.value}
                      onSelect={(currentValue) => {
                        onChange(currentValue === value ? null : currentValue);
                        setOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === el.value ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {el.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
                {actions && (
                  <>
                    <CommandSeparator />
                    <CommandGroup heading="Actions">{actions}</CommandGroup>
                  </>
                )}
              </div>
            </div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

type ComboboxProps = {
  placeholder?: string;
  searchPlaceholder?: string;
  emptySearchMessage?: string;
  options: Array<{ label: string; value: string }>;
  value?: string | null;
  onChange: (value: string | null) => void;
  buttonProps?: React.ComponentProps<typeof Button>;
  actions?: React.ReactNode;
};

import { ChevronsUpDown, Plus, X } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { cn } from "src/shared/lib/utils";
import { Badge } from "src/shared/ui/badge";
import { Button } from "src/shared/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "src/shared/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "src/shared/ui/popover";

export type ComboboxOption = { value: string; label: string };

type ComboboxProps = {
  value: ComboboxOption[];
  onChange: (items: ComboboxOption[]) => void;
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  canCreate?: boolean;
  createLabel?: (search: string) => ReactNode;
  className?: string;
};

export function Combobox({
  value,
  onChange,
  options,
  placeholder = "Select items…",
  searchPlaceholder = "Search…",
  emptyText = "No results found.",
  canCreate = false,
  createLabel,
  className,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedValues = new Set(value.map((item) => item.value));

  const filtered = options.filter(
    (opt) =>
      !selectedValues.has(opt.value) &&
      opt.label.toLowerCase().includes(search.toLowerCase()),
  );

  const showCreate =
    canCreate &&
    search.trim().length > 0 &&
    !options.some(
      (opt) => opt.label.toLowerCase() === search.trim().toLowerCase(),
    ) &&
    !value.some((v) => v.label.toLowerCase() === search.trim().toLowerCase());

  const addItem = (item: ComboboxOption) => {
    onChange([...value, item]);
    setSearch("");
  };

  const removeItem = (itemValue: string) => {
    onChange(value.filter((v) => v.value !== itemValue));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className={cn(
              "w-full justify-between font-normal h-auto min-h-9 py-1.5 px-3 border-input bg-transparent dark:bg-input/30",
              className,
            )}
          >
            <span className="flex flex-wrap gap-1">
              {value.length === 0 ? (
                <span className="text-muted-foreground text-sm">
                  {placeholder}
                </span>
              ) : (
                value.map((item) => (
                  <Badge
                    key={item.value}
                    variant="secondary"
                    className="gap-1 pr-1 text-xs"
                  >
                    {item.label}
                    <button
                      type="button"
                      aria-label={`Remove ${item.label}`}
                      className="cursor-pointer rounded-sm hover:bg-muted"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(item.value);
                      }}
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))
              )}
            </span>
            <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground ml-2" />
          </Button>
        }
      />
      <PopoverContent className="w-64 p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {showCreate && (
              <CommandGroup heading="Create">
                <CommandItem
                  onSelect={() =>
                    addItem({ value: search.trim(), label: search.trim() })
                  }
                  className="gap-2 cursor-pointer"
                >
                  <Plus className="size-4" />
                  {createLabel ? (
                    createLabel(search.trim())
                  ) : (
                    <>Create &ldquo;{search.trim()}&rdquo;</>
                  )}
                </CommandItem>
              </CommandGroup>
            )}
            {filtered.length > 0 && (
              <CommandGroup heading="Suggestions">
                {filtered.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    onSelect={() => addItem(opt)}
                    className="cursor-pointer"
                  >
                    {opt.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {!showCreate && filtered.length === 0 && (
              <CommandEmpty>{emptyText}</CommandEmpty>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

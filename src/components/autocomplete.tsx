import { ComponentProps, ReactNode, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { PopoverV2 } from "./popover-v2";
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { Command } from "cmdk";
import { usePopover } from "@/lib/use-popover";

export function Autocomplete({
  options,
  value = "",
  onChange,
  inputProps,
  actions,
}: AutocompleteProps) {
  const [search, setSearch] = useState(value);
  const popover = usePopover<HTMLInputElement>();

  useEffect(() => {
    setSearch(value);
  }, [value]);

  const handleChange = (newValue: string) => {
    onChange(newValue);
    setSearch(newValue);
    popover.setOpen(false);
  };

  const onClear = () => {
    setSearch("");
    onChange("");
    popover.setOpen(false);
  };

  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(search.toLowerCase()) &&
      option.label.toLowerCase() !== search.toLowerCase(),
  );

  return (
    <Command>
      <Input
        ref={popover.anchor}
        value={search}
        onFocus={() => popover.setOpen(true)}
        onBlur={() => handleChange(search)}
        onChange={(e) => {
          setSearch(e.target.value);
          if (!popover.open) popover.setOpen(true);
        }}
        onClear={onClear}
        {...inputProps}
      />
      {popover.open && filteredOptions.length > 0 && (
        <PopoverV2 {...popover} className="p-1">
          <CommandEmpty>Aucun résultat.</CommandEmpty>
          <CommandList>
            <div className="max-h-[300px] flex flex-col">
              <div className="flex-1 overflow-auto">
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    value={option.value}
                    onSelect={() => handleChange(option.value)}
                    className={"cursor-pointer"}
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </div>
              {actions && (
                <>
                  <CommandSeparator className="mt-1 shrink-0" />
                  <CommandGroup heading="Actions" className="shrink-0">
                    {actions}
                  </CommandGroup>
                </>
              )}
            </div>
          </CommandList>
        </PopoverV2>
      )}
    </Command>
  );
}

type AutocompleteProps = {
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  inputProps?: ComponentProps<typeof Input>;
  actions?: ReactNode;
};

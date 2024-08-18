import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { PopoverV2, usePopoverV2 } from "./popover-v2";
import { CommandItem, CommandList } from "./ui/command";
import { Command } from "cmdk";

export function Autocomplete({ options, value, onChange }: AutocompleteProps) {
  const [search, setSearch] = useState("");
  const popover = usePopoverV2<HTMLInputElement>();

  const valueLabel =
    options.find((option) => option.value === value)?.label ?? "";
  useEffect(() => {
    setSearch(valueLabel);
  }, [valueLabel]);

  const handleChange = (newSearch: string) => {
    setSearch(newSearch);
    onChange(newSearch);
    popover.setOpen(false);
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Command>
      <Input
        ref={popover.anchor}
        value={search}
        onFocus={() => popover.setOpen(true)}
        onBlur={() => handleChange(search)}
        onChange={(e) => setSearch(e.target.value)}
      />
      {popover.open && (
        <PopoverV2 {...popover} className="p-1">
          <CommandList>
            {filteredOptions.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={(v) => handleChange(v)}
              >
                {option.label}
              </CommandItem>
            ))}
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
};

import { ComponentProps, ReactNode, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { PopoverV2, usePopoverV2 } from "./popover-v2";
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { Command } from "cmdk";
import { Button } from "./ui/button";

export function Autocomplete({
  hideEmptySuggestion,
  options,
  value = "",
  onChange,
  inputProps,
  freeSolo,
  suggestionFooter,
}: AutocompleteProps) {
  const [search, setSearch] = useState("");
  const popover = usePopoverV2<HTMLInputElement>();

  const valueLabel = freeSolo
    ? value
    : options.find((option) => option.value === value)?.label ?? "";

  useEffect(() => {
    setSearch(valueLabel);
  }, [valueLabel]);

  const handleChange = (newValue: string) => {
    const exist = options.find((option) => option.value === newValue);
    if (exist) {
      onChange(exist.value);
      setSearch(exist.label);
      popover.setOpen(false);
      return;
    }

    // keep previous value
    const oldOption = options.find((option) => option.value === value);
    onChange(oldOption?.value ?? "");
    setSearch(oldOption?.label ?? "");
    popover.setOpen(false);
  };

  const handleChangeFreeSolo = (newSearch: string) => {
    setSearch(newSearch);
    onChange(newSearch);
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
      option.label !== search,
  );

  return (
    <Command>
      <Input
        ref={popover.anchor}
        value={search}
        onFocus={() => popover.setOpen(true)}
        // freeSolo use blur to update the value
        onBlur={() =>
          freeSolo ? handleChangeFreeSolo(search) : handleChange(value)
        }
        onChange={(e) => {
          setSearch(e.target.value);
          if (!popover.open) popover.setOpen(true);
        }}
        onClear={onClear}
        {...inputProps}
      />
      {popover.open &&
        (!hideEmptySuggestion ||
          (hideEmptySuggestion && filteredOptions.length > 0)) && (
          <PopoverV2 {...popover} className="p-1">
            <CommandEmpty>Aucun résultat.</CommandEmpty>
            <CommandList>
              <CommandGroup heading="Suggestions">
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
              </CommandGroup>
              {suggestionFooter && (
                <>
                  <CommandSeparator className="mt-1" />
                  <CommandGroup heading="Actions">
                    {suggestionFooter}
                  </CommandGroup>
                </>
              )}
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
  hideEmptySuggestion?: boolean;
  inputProps?: ComponentProps<typeof Input>;
  freeSolo?: boolean;
  suggestionFooter?: ReactNode;
};

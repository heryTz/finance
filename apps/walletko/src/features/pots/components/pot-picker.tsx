import { Plus } from "lucide-react";
import { useState } from "react";
import type { PotWithBalanceDTO } from "src/server/contracts/pot";
import { useFormatCurrency } from "src/shared/hooks/use-format-currency";
import { Button } from "src/shared/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "src/shared/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "src/shared/ui/popover";

type PotPickerProps = {
  options: PotWithBalanceDTO[];
  onSelect: (pot: PotWithBalanceDTO) => void;
};

export function PotPicker({ options, onSelect }: PotPickerProps) {
  const [open, setOpen] = useState(false);
  const { formatFromCent } = useFormatCurrency();

  if (options.length === 0) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button type="button" variant="outline" size="sm">
            <Plus />
            Add pot
          </Button>
        }
      />
      <PopoverContent className="w-64 p-0" align="start">
        <Command>
          <CommandList>
            <CommandGroup>
              {options.map((pot) => (
                <CommandItem
                  key={pot.id}
                  onSelect={() => {
                    onSelect(pot);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <span className="flex-1 truncate">{pot.name}</span>
                  <span className="text-xs text-muted-foreground ml-2 tabular-nums">
                    {formatFromCent(pot.balance)}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

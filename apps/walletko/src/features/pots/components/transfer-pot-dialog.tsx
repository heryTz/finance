import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { dashboardKeys } from "src/features/dashboard/queries";
import { potsQuery } from "src/features/pots/queries";
import type { PotWithBalanceDTO } from "src/server/contracts/pot";
import { createPotTransferFn } from "src/server/functions/pots.fn";
import { useAppForm } from "src/shared/form/form-setup";
import { useFormatCurrency } from "src/shared/hooks/use-format-currency";
import { useFormatError } from "src/shared/lib/use-format-error";
import { Alert, AlertDescription } from "src/shared/ui/alert";
import { Button } from "src/shared/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "src/shared/ui/command";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "src/shared/ui/dialog";
import { FormField } from "src/shared/ui/form-field";
import { Popover, PopoverContent, PopoverTrigger } from "src/shared/ui/popover";
import { z } from "zod";

type TransferPotDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const transferPotSchema = z
  .object({
    fromPotId: z.string().min(1, "Select a source pot."),
    fromPotBalance: z.number().min(0),
    toPotId: z.string().min(1, "Select a destination pot."),
    amount: z
      .number({ error: "Enter a valid amount." })
      .positive("Amount must be greater than zero."),
  })
  .refine((d) => d.amount <= d.fromPotBalance / 100, {
    message: "Amount exceeds available balance.",
    path: ["amount"],
  });

export function TransferPotDialog({
  open,
  onOpenChange,
}: TransferPotDialogProps) {
  const formId = useId();
  const qc = useQueryClient();
  const { data: pots } = useSuspenseQuery(potsQuery);
  const { formatFromCent } = useFormatCurrency();
  const formatError = useFormatError();

  const mutation = useMutation({
    mutationFn: createPotTransferFn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: potsQuery.queryKey });
      qc.invalidateQueries({ queryKey: dashboardKeys.all });
      onOpenChange(false);
    },
  });

  const f = useAppForm({
    defaultValues: {
      fromPotId: "",
      fromPotBalance: 0,
      toPotId: "",
      amount: 0,
    },
    validators: { onSubmit: transferPotSchema },
    onSubmit: ({ value }) =>
      mutation.mutate({
        data: {
          fromPotId: value.fromPotId,
          toPotId: value.toPotId,
          amount: value.amount,
        },
      }),
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: i know what i do
  useEffect(() => {
    if (open) {
      f.reset();
      mutation.reset();
    }
  }, [open]);

  const allPots = pots as PotWithBalanceDTO[];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form
        id={formId}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          f.handleSubmit();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transfer between pots</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <f.AppField name="fromPotId">
              {(field) => {
                const toId = f.getFieldValue("toPotId");
                const available = allPots.filter((p) => p.id !== toId);
                const selected = available.find(
                  (p) => p.id === field.state.value,
                );
                const error = field.state.meta.isValid
                  ? undefined
                  : formatError(field.state.meta.errors);
                return (
                  <FormField label="From" error={error}>
                    <PotSelectPopover
                      options={available}
                      selected={selected}
                      formatFromCent={formatFromCent}
                      onSelect={(pot) => {
                        field.handleChange(pot.id);
                        f.setFieldValue("fromPotBalance", pot.balance);
                      }}
                    />
                    {selected && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Max {formatFromCent(selected.balance)}
                      </p>
                    )}
                  </FormField>
                );
              }}
            </f.AppField>

            <f.AppField name="toPotId">
              {(field) => {
                const fromId = f.getFieldValue("fromPotId");
                const available = allPots.filter((p) => p.id !== fromId);
                const selected = available.find(
                  (p) => p.id === field.state.value,
                );
                const error = field.state.meta.isValid
                  ? undefined
                  : formatError(field.state.meta.errors);
                return (
                  <FormField label="To" error={error}>
                    <PotSelectPopover
                      options={available}
                      selected={selected}
                      formatFromCent={formatFromCent}
                      onSelect={(pot) => field.handleChange(pot.id)}
                    />
                  </FormField>
                );
              }}
            </f.AppField>

            <f.AppField name="amount">
              {(field) => <field.AmountField label="Amount" />}
            </f.AppField>

            {mutation.isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  Something went wrong. Please try again.
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <DialogClose
              render={
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              }
            />
            <f.AppForm>
              <f.SubmitButton form={formId} isLoading={mutation.isPending}>
                Transfer
              </f.SubmitButton>
            </f.AppForm>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

type PotSelectPopoverProps = {
  options: PotWithBalanceDTO[];
  selected: PotWithBalanceDTO | undefined;
  formatFromCent: (cents: number) => string;
  onSelect: (pot: PotWithBalanceDTO) => void;
};

function PotSelectPopover({
  options,
  selected,
  formatFromCent,
  onSelect,
}: PotSelectPopoverProps) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className="w-full justify-between font-normal"
          >
            {selected ? (
              <span className="flex items-center gap-2">
                <span
                  className="size-2 rounded-full shrink-0"
                  style={{ backgroundColor: selected.color }}
                />
                {selected.name}
              </span>
            ) : (
              <span className="text-muted-foreground">Select pot…</span>
            )}
            <ChevronDown className="size-4 opacity-50" />
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
                  <span
                    className="size-2 rounded-full shrink-0"
                    style={{ backgroundColor: pot.color }}
                  />
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

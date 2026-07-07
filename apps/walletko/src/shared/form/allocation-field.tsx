import type { ModalAllocation } from "src/shared/components/allocation-disc";
import { AllocationSliders } from "src/shared/components/allocation-sliders";
import { useFieldContext } from "src/shared/form/form-setup";
import { useFormatError } from "src/shared/lib/use-format-error";
import { cn } from "src/shared/lib/utils";
import { Label } from "src/shared/ui/label";

type AllocationFieldProps = {
  colors: string[];
};

export function AllocationField({ colors }: AllocationFieldProps) {
  const field = useFieldContext<ModalAllocation[]>();
  const formatError = useFormatError();
  const allocations = field.state.value;
  const error = field.state.meta.isValid
    ? undefined
    : formatError(field.state.meta.errors);
  const pots = allocations.map(({ id, name, percentage }) => ({
    id,
    name,
    percentage,
  }));
  const total = allocations.reduce((s, a) => s + a.percentage, 0);

  const handleChange = (updated: { id: string; percentage: number }[]) => {
    field.handleChange(
      allocations.map((a) => {
        const match = updated.find((u) => u.id === a.id);
        return match ? { ...a, percentage: match.percentage } : a;
      }),
    );
  };

  return (
    <div className="space-y-3">
      <Label>Allocation</Label>
      <AllocationSliders pots={pots} colors={colors} onChange={handleChange} />
      <p
        className={cn(
          "text-sm tabular-nums text-right",
          total === 100 ? "text-muted-foreground" : "text-destructive",
        )}
      >
        Total: {total}%{total !== 100 && " (must equal 100%)"}
      </p>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

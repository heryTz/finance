import { Lock, LockOpen } from "lucide-react";
import { useRef, useState } from "react";
import type { AllocationEntry } from "src/shared/components/allocation-disc";
import { Button } from "src/shared/ui/button";
import { Input } from "src/shared/ui/input";
import { Slider } from "src/shared/ui/slider";

export type AllocationSlidersEntry = AllocationEntry & { name: string };

const MIN_POT_PCT = 1;

function redistributeExcludingLocked(
  pots: AllocationSlidersEntry[],
  changedId: string,
  newValue: number,
  lockedIds: Set<string>,
): AllocationSlidersEntry[] {
  const lockedSum = pots
    .filter((p) => lockedIds.has(p.id))
    .reduce((s, p) => s + p.percentage, 0);
  const unlockedOthers = pots.filter(
    (p) => p.id !== changedId && !lockedIds.has(p.id),
  );
  const clamped = Math.max(
    MIN_POT_PCT,
    Math.min(newValue, 100 - lockedSum - unlockedOthers.length * MIN_POT_PCT),
  );
  const remaining = 100 - clamped - lockedSum;
  const excess = remaining - unlockedOthers.length * MIN_POT_PCT;
  const totalUnlocked = unlockedOthers.reduce((s, p) => s + p.percentage, 0);

  const result = pots.map((p) => {
    if (p.id === changedId) return { ...p, percentage: clamped };
    if (lockedIds.has(p.id)) return p;
    const proportional =
      excess <= 0 || totalUnlocked === 0
        ? 0
        : Math.round((p.percentage / totalUnlocked) * excess);
    return { ...p, percentage: MIN_POT_PCT + proportional };
  });

  const sum = result.reduce((s, p) => s + p.percentage, 0);
  if (sum !== 100) {
    const lastIdx = [...result]
      .map((p, i) => ({ p, i }))
      .reverse()
      .find(({ p }) => p.id !== changedId && !lockedIds.has(p.id))?.i;
    if (lastIdx !== undefined) {
      result[lastIdx] = {
        ...result[lastIdx],
        percentage: result[lastIdx].percentage + (100 - sum),
      };
    }
  }

  return result;
}

type ColorBarProps = { pots: AllocationSlidersEntry[]; colors: string[] };

function ColorBar({ pots, colors }: ColorBarProps) {
  return (
    <div className="flex h-2 overflow-hidden rounded-full">
      {pots.map((p, i) => (
        <div
          key={p.id}
          style={{
            flex: p.percentage,
            backgroundColor: colors[i % colors.length],
          }}
        />
      ))}
    </div>
  );
}

type AllocationSlidersProps = {
  pots: AllocationSlidersEntry[];
  colors: string[];
  onChange?: (allocations: AllocationEntry[]) => void;
};

export function AllocationSliders({
  pots,
  colors,
  onChange,
}: AllocationSlidersProps) {
  const [lockedIds, setLockedIds] = useState<Set<string>>(new Set());
  const [draftValues, setDraftValues] = useState<Record<string, string>>({});
  const baselinePotsRef = useRef<AllocationSlidersEntry[] | null>(null);

  const toggleLock = (id: string) => {
    setLockedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleChange = (changedId: string, rawValue: number) => {
    if (!onChange || Number.isNaN(rawValue)) return;
    onChange(redistributeExcludingLocked(pots, changedId, rawValue, lockedIds));
  };

  return (
    <div className="space-y-3">
      <ColorBar pots={pots} colors={colors} />
      {pots.map((pot, i) => {
        const locked = lockedIds.has(pot.id);
        const disabled = locked || !onChange;
        const inputValue =
          pot.id in draftValues ? draftValues[pot.id] : String(pot.percentage);
        return (
          <div key={pot.id} className="flex items-center gap-3">
            <span
              className="size-3 rounded-full shrink-0"
              style={{ backgroundColor: colors[i % colors.length] }}
            />
            <span className="inline-flex text-sm w-20 truncate">
              {pot.name}
            </span>
            <Slider
              className="flex-1"
              value={[pot.percentage]}
              min={0}
              max={100}
              step={1}
              disabled={disabled}
              onValueChange={(value) => handleChange(pot.id, value as number)}
            />
            <div className="flex items-center gap-1">
              <Input
                type="number"
                className="w-16 text-right tabular-nums"
                value={inputValue}
                min={0}
                max={100}
                disabled={disabled}
                onChange={(e) => {
                  if (!(pot.id in draftValues)) {
                    baselinePotsRef.current = pots;
                  }
                  setDraftValues((prev) => ({
                    ...prev,
                    [pot.id]: e.target.value,
                  }));
                  const parsed = parseInt(e.target.value, 10);
                  if (!Number.isNaN(parsed) && onChange) {
                    onChange(
                      redistributeExcludingLocked(
                        baselinePotsRef.current ?? pots,
                        pot.id,
                        parsed,
                        lockedIds,
                      ),
                    );
                  }
                }}
                onBlur={() => {
                  baselinePotsRef.current = null;
                  setDraftValues((prev) => {
                    const next = { ...prev };
                    delete next[pot.id];
                    return next;
                  });
                }}
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            {onChange && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => toggleLock(pot.id)}
                aria-label={locked ? "Unlock pot" : "Lock pot"}
              >
                {locked ? <Lock /> : <LockOpen />}
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}

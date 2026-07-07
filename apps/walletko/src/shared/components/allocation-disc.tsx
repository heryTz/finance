import { useMemo, useRef, useState } from "react";
import { Cell, Pie, PieChart } from "recharts";

const CHART_SIZE = 144;
const CX = 72;
const CY = 72;
const OUTER_R = 60;
const INNER_R = 38;
const HANDLE_R = (OUTER_R + INNER_R) / 2;

function cumPctToXY(cumPct: number) {
  const deg = 90 - (cumPct / 100) * 360;
  const rad = (deg * Math.PI) / 180;
  return {
    x: CX + HANDLE_R * Math.cos(rad),
    y: CY - HANDLE_R * Math.sin(rad),
  };
}

function xyToRawCumPct(x: number, y: number) {
  const dx = x - CX;
  const dy = -(y - CY);
  const deg = Math.atan2(dy, dx) * (180 / Math.PI);
  let pct = ((90 - deg) / 360) * 100;
  if (pct < 0) pct += 100;
  if (pct >= 100) pct -= 100;
  return pct;
}

export type AllocationEntry = { id: string; percentage: number };

export type ModalAllocation = { id: string; name: string; percentage: number };

export function redistributeExcluding<
  T extends { id: string; percentage: number },
>(pots: T[], changedId: string, newValue: number): T[] {
  const others = pots.filter((p) => p.id !== changedId);
  const remaining = 100 - newValue;
  const totalOthers = others.reduce((s, p) => s + p.percentage, 0);

  return pots.map((p) => {
    if (p.id === changedId) return { ...p, percentage: newValue };
    if (totalOthers === 0) {
      return { ...p, percentage: Math.round(remaining / others.length) };
    }
    return {
      ...p,
      percentage: Math.round((p.percentage / totalOthers) * remaining),
    };
  });
}

function positionsToPots(
  positions: number[],
  pots: AllocationEntry[],
): AllocationEntry[] {
  const N = positions.length;
  const result = pots.map((p, i) => {
    const prevPos = i === 0 ? positions[N - 1] - 100 : positions[i - 1];
    return { id: p.id, percentage: Math.round(positions[i] - prevPos) };
  });
  const sum = result.reduce((s, p) => s + p.percentage, 0);
  if (sum !== 100) {
    const last = result.length - 1;
    result[last] = {
      ...result[last],
      percentage: result[last].percentage + (100 - sum),
    };
  }
  return result;
}

type PotAllocationRowProps = {
  name: string;
  percentage: number;
  color: string;
};

export function PotAllocationRow({
  name,
  percentage,
  color,
}: PotAllocationRowProps) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="size-3 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="flex-1 text-sm truncate">{name}</span>
      <span className="text-sm tabular-nums text-muted-foreground">
        {percentage}%
      </span>
    </div>
  );
}

type AllocationDiscProps = {
  pots: AllocationEntry[];
  colors: string[];
  onChange?: (allocations: { id: string; percentage: number }[]) => void;
};

export function AllocationDisc({
  pots,
  colors,
  onChange,
}: AllocationDiscProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activePositions, setActivePositions] = useState<number[] | null>(null);
  const [wrapPosition, setWrapPosition] = useState(100);

  const basePositions = useMemo(() => {
    let cum = wrapPosition - 100;
    return pots.map((p) => {
      cum += p.percentage;
      return cum;
    });
  }, [pots, wrapPosition]);

  const renderPositions = activePositions ?? basePositions;
  const displayPots = positionsToPots(renderPositions, pots);
  const data = displayPots.map((p) => ({ value: p.percentage, id: p.id }));

  const wrapPos =
    renderPositions.length > 0
      ? renderPositions[renderPositions.length - 1]
      : 100;
  const pieStartAngle = 90 - (wrapPos / 100) * 360;

  const handles: {
    key: string;
    x: number;
    y: number;
    index: number;
    color: string;
  }[] = [];

  if (onChange && pots.length > 1) {
    renderPositions.forEach((pos, i) => {
      const { x, y } = cumPctToXY(pos);
      handles.push({
        key: `${pots[i].id}-handle`,
        x,
        y,
        index: i,
        color: colors[i % colors.length],
      });
    });
  }

  const handlePointerDown = (
    e: React.PointerEvent<SVGCircleElement>,
    index: number,
  ) => {
    if (!onChange) return;
    const onChangeFn = onChange;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    // biome-ignore lint/style/noNonNullAssertion: ref is set before any pointer event fires
    const svg = svgRef.current!;
    const N = pots.length;
    const startPositions = basePositions;
    const prevPos =
      index === 0 ? startPositions[N - 1] - 100 : startPositions[index - 1];
    const nextPos =
      index === N - 1 ? startPositions[0] + 100 : startPositions[index + 1];

    let lastClampedPos = startPositions[index];

    const onMove = (ev: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      const mouseX = ((ev.clientX - rect.left) / rect.width) * CHART_SIZE;
      const mouseY = ((ev.clientY - rect.top) / rect.height) * CHART_SIZE;
      let rawCumPct = xyToRawCumPct(mouseX, mouseY);
      if (index === N - 1 && rawCumPct < prevPos) rawCumPct += 100;
      const clampedPos = Math.round(
        Math.max(prevPos + 1, Math.min(nextPos - 1, rawCumPct)),
      );
      lastClampedPos = clampedPos;
      const newPositions = [...startPositions];
      newPositions[index] = clampedPos;
      setActivePositions(newPositions);
      onChangeFn(positionsToPots(newPositions, pots));
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      if (index === N - 1) setWrapPosition(lastClampedPos);
      setActivePositions(null);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <div className="relative w-36 h-36">
      <PieChart
        width={CHART_SIZE}
        height={CHART_SIZE}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      >
        <Pie
          data={data}
          cx={CX}
          cy={CY}
          startAngle={pieStartAngle}
          endAngle={pieStartAngle - 360}
          outerRadius={OUTER_R}
          innerRadius={INNER_R}
          dataKey="value"
          strokeWidth={0}
          isAnimationActive={false}
        >
          {data.map((entry, i) => (
            <Cell key={entry.id} fill={colors[i % colors.length]} />
          ))}
        </Pie>
      </PieChart>

      <svg
        ref={svgRef}
        aria-hidden="true"
        className="absolute inset-0 w-36 h-36"
        viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
        style={{ pointerEvents: "none" }}
      >
        {handles.map((h) => (
          <circle
            key={h.key}
            cx={h.x}
            cy={h.y}
            r={7}
            fill="white"
            stroke={h.color}
            strokeWidth={2.5}
            className="drop-shadow-sm"
            style={{
              pointerEvents: "all",
              touchAction: "none",
              cursor: "grab",
            }}
            onPointerDown={(e) => handlePointerDown(e, h.index)}
          />
        ))}
      </svg>
    </div>
  );
}

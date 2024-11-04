import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.locale("fr");
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export function MonthPickerContent<Type extends "range" | "simple">({
  value,
  onChange,
  type,
}: MonthPickerContentProps<Type>) {
  const [currentYear, setCurrentYear] = useState(dayjs().get("year"));
  const [monthHoveredIndex, setMonthHoveredIndex] = useState<number>();

  const onClickMonth = (monthIndex: number) => {
    const month = dayjs()
      .set("year", currentYear)
      .startOf("year")
      .set("month", monthIndex);

    if (type === "simple") {
      onChange(month.toDate());
      return;
    }

    if (!value?.from) {
      onChange({ from: month.startOf("month").toDate(), to: null });
      return;
    }

    if (value.from && value.to) {
      onChange({ from: month.startOf("month").toDate(), to: null });
      return;
    }

    if (value.from && dayjs(value.from).isAfter(month)) {
      onChange({ from: month.startOf("month").toDate(), to: null });
      return;
    }

    onChange({ ...value, to: month.endOf("month").toDate() });
    setMonthHoveredIndex(undefined);
  };

  return (
    <div className="p-3">
      <div className="grid gap-3">
        <div className="flex items-center justify-between">
          <Button
            variant={"outline"}
            className="p-0 bg-transparent opacity-50 hover:opacity-100 h-[28px] w-[28px]"
            onClick={() => setCurrentYear(currentYear - 1)}
          >
            <ChevronLeftIcon className="w-3 h-3" />
          </Button>
          <div className="text-sm font-medium">{currentYear}</div>
          <Button
            variant={"outline"}
            className="p-0 bg-transparent opacity-50 hover:opacity-100 h-[28px] w-[28px]"
            onClick={() => setCurrentYear(currentYear + 1)}
          >
            <ChevronRightIcon className="w-3 h-3" />
          </Button>
        </div>
        <div className="grid grid-cols-3 grid-rows-3 gap-y-2">
          {Array.from({ length: 12 }).map((_, monthIndex) => {
            const month = dayjs()
              .set("year", currentYear)
              .startOf("year")
              .add(monthIndex, "month");

            let isSelected = false;
            let isFirst = false;
            let isLast = false;
            let isHovered = false;

            if (type === "simple") {
              isSelected = value ? dayjs(value).isSame(month) : false;
            } else {
              if (value?.from && value.to) {
                isSelected =
                  dayjs(value.from).isSameOrBefore(month) &&
                  dayjs(value.to).isSameOrAfter(month);
              }

              isFirst = value?.from
                ? dayjs(value.from).isSame(month.startOf("month"))
                : false;

              isLast = value?.to
                ? dayjs(value.to).isSame(month.endOf("month"))
                : false;

              if (value?.from && !value?.to && monthHoveredIndex) {
                isHovered =
                  dayjs(value.from).isBefore(month) &&
                  dayjs()
                    .set("year", currentYear)
                    .startOf("year")
                    .add(monthHoveredIndex, "month")
                    .isSameOrAfter(month);
              }
            }

            return (
              <Button
                variant={isFirst || isLast ? "default" : "ghost"}
                type="button"
                role="gridcell"
                aria-selected={isSelected}
                className={cn("text-center text-sm p-0 h-8 w-11", {
                  "bg-accent text-accent-foreground rounded-none":
                    (isSelected && !isFirst && !isLast) || isHovered,
                  "rounded-l-md": (monthIndex + 1) % 3 === 1,
                  "rounded-r-md": (monthIndex + 1) % 3 === 0,
                })}
                key={monthIndex}
                onClick={() => onClickMonth(monthIndex)}
                onMouseOver={() => setMonthHoveredIndex(monthIndex)}
              >
                {dayjs().startOf("year").add(monthIndex, "month").format("MMM")}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export type MonthRange = {
  from: Date;
  to?: Date | null;
};

type MonthPickerContentProps<Type extends "range" | "simple"> =
  Type extends "range"
    ? {
        type: Type;
        value?: MonthRange | null;
        onChange: (value: MonthRange) => void;
      }
    : {
        type: Type;
        value?: Date | null;
        onChange: (value: Date) => void;
      };

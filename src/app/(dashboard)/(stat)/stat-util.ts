import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import "dayjs/locale/fr";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export const statData = {
  income: {
    label: "Revenu par mois",
  },
  expense: {
    label: "Dépense par mois",
  },
  retainedEarnings: {
    label: "Bénéfice cumulé",
  },
} as const;

// Month index start by 0
export function getMonthRange(range: {
  from: Date;
  to: Date;
  customActualDate?: Date | null;
}) {
  const startYearDayjs = dayjs(range.from).startOf("month");
  const endYearDayjs = dayjs(range.to).endOf("month");
  const delta = endYearDayjs.get("year") - startYearDayjs.get("year") + 1;

  return Array.from({ length: 12 * delta }, (_, i) => i).filter(
    (monthIndex) => {
      const monthDayjs = dayjs(range.from)
        .startOf("year")
        .add(monthIndex, "month");
      return (
        monthDayjs.isSameOrAfter(startYearDayjs) &&
        monthDayjs.isSameOrBefore(endYearDayjs) &&
        monthDayjs.isSameOrBefore(dayjs(range.customActualDate).endOf("month"))
      );
    },
  );
}

export function getMonthLabel(params: {
  monthIndex: number;
  from: Date;
  to: Date;
}) {
  dayjs.locale("fr");
  const startYear = params.from.getFullYear();
  const endYear = params.to.getFullYear();
  const delta = endYear - startYear;
  return dayjs(params.from)
    .startOf("year")
    .add(params.monthIndex, "month")
    .format(delta > 0 ? "MMMM YYYY" : "MMMM");
}

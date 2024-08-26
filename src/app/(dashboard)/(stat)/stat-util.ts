import dayjs from "dayjs";
import "dayjs/locale/fr";

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
export function getMonthRange(range: { startDate: Date; endDate: Date }) {
  const startYear = range.startDate.getFullYear();
  const endYear = range.endDate.getFullYear();
  const delta = endYear - startYear;
  return Array.from({ length: 12 * (delta + 1) }, (_, i) => i);
}

export function getMonthLabel(params: {
  monthIndex: number;
  startDate: Date;
  endDate: Date;
}) {
  dayjs.locale("fr");
  const startYear = params.startDate.getFullYear();
  const endYear = params.endDate.getFullYear();
  const delta = endYear - startYear;
  return dayjs(params.startDate)
    .add(params.monthIndex, "month")
    .format(delta > 0 ? "MMMM YYYY" : "MMMM");
}

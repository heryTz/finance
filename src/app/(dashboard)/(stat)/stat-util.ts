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
export function getMonthRange(range: { from: Date; to: Date }) {
  const startYear = range.from.getFullYear();
  const endYear = range.to.getFullYear();
  const delta = endYear - startYear;
  return Array.from({ length: 12 * (delta + 1) }, (_, i) => i);
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
    .add(params.monthIndex, "month")
    .format(delta > 0 ? "MMMM YYYY" : "MMMM");
}

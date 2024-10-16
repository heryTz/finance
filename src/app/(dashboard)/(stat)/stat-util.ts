import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import "dayjs/locale/fr";
import utc from "dayjs/plugin/utc";
import { BanknoteIcon } from "lucide-react";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(utc);

export const statData = {
  income: {
    label: "Revenu par mois",
  },
  expense: {
    label: "Dépense par mois",
  },
  balance: {
    label: "Balance",
  },
} as const;

// Month index start by 0
export function getMonthRange(range: {
  from: Date;
  to: Date;
  customActualDate?: Date | null;
}) {
  const _range = {
    from: new Date("2024-04-30T21:00:00.000Z"),
    to: new Date("2024-04-30T23:59:59.999Z"),
    customActualDate: null,
  };
  const startYearDayjs = dayjs(range.from).startOf("month");
  const endYearDayjs = dayjs(range.to).endOf("month");
  const delta = endYearDayjs.get("year") - startYearDayjs.get("year") + 1;

  // {
  //   range: '2024-04-30T21:00:00.000Z',
  //   to: '2024-04-30T23:59:59.999Z',
  //   startYearDayjs: '2024-04-01T00:00:00.000Z',
  //   endYearDayjs: '2024-04-30T23:59:59.999Z',
  //   delta: 1
  // }
  // { monthRange: [ 3 ] }
  //
  // {
  //   range: '2024-04-30T21:00:00.000Z',
  //   to: '2024-05-31T20:59:59.999Z',
  //   startYearDayjs: '2024-04-30T21:00:00.000Z',
  //   endYearDayjs: '2024-05-31T20:59:59.999Z',
  //   delta: 1
  // }
  // { monthRange: [ 4 ] }
  //
  //
  //=======================================================================

  // {
  //   range: '2024-04-30T21:00:00.000Z',
  //   to: '2024-05-31T20:59:59.999Z',
  //   startYearDayjs: '2024-04-01T00:00:00.000Z',
  //   endYearDayjs: '2024-05-31T23:59:59.999Z',
  //   delta: 1
  // }
  // { monthRange: [ 3, 4 ] }
  //
  // {
  //   range: '2024-04-30T21:00:00.000Z',
  //   to: '2024-05-31T20:59:59.999Z',
  //   startYearDayjs: '2024-04-30T21:00:00.000Z',
  //   endYearDayjs: '2024-05-31T20:59:59.999Z',
  //   delta: 1
  // }
  // { monthRange: [ 4 ] }

  console.log({
    range: range.from.toISOString(),
    to: range.to.toISOString(),
    startYearDayjs: startYearDayjs.toISOString(),
    endYearDayjs: endYearDayjs.toISOString(),
    delta: delta,
  });

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

export const statDisplayConfig = [
  { name: "currentBalance", title: "Balance", Icon: BanknoteIcon, order: 1 },
  {
    name: "currentIncome",
    title: "Revenu du mois",
    Icon: BanknoteIcon,
    order: 2,
  },
  {
    name: "currentExpense",
    title: "Dépense du mois",
    Icon: BanknoteIcon,
    order: 3,
  },
  { name: "totalIncome", title: "Revenu total", Icon: BanknoteIcon, order: 4 },
  {
    name: "totalExpense",
    title: "Dépense totale",
    Icon: BanknoteIcon,
    order: 5,
  },
] as const;

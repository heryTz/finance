import dayjs from "dayjs";
import "dayjs/locale/fr";

export function humanAmount(nb: number) {
  return Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(nb);
}

export function humanDate(date: Date | string | null) {
  if (!date) return "";
  dayjs.locale("fr");
  return dayjs(date).format("DD MMM YYYY");
}

export function humanMonthDate(date: Date | string | null) {
  if (!date) return "";
  dayjs.locale("fr");
  return dayjs(date).format("MMM YYYY");
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function humanFromLastMonth(value: number) {
  return `${value >= 0 ? "+" : "-"}${value.toFixed(2)}% du mois dernier`;
}

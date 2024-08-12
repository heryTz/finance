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

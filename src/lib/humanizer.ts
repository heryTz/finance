import dayjs from "dayjs";

export function humanAmount(nb: number) {
  return Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(nb);
}

export function humanDate(date: Date | string | null) {
  if (!date) return "";
  return dayjs(date).format("DD/MM/YYYY");
}

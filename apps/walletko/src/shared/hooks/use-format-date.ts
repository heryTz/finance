const formatter = new Intl.DateTimeFormat("fr-MG", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function useFormatDate() {
  return (date: Date | string) => formatter.format(new Date(date));
}

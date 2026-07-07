export function useFormatError() {
  const fmt = (msg: string) =>
    msg.startsWith("i18n:") ? msg.replace("i18n:", "") : msg;
  return (issues: unknown): string => {
    if (!issues) return "Unknown error";
    if (Array.isArray(issues))
      return issues
        .map((i) =>
          typeof i === "string"
            ? fmt(i)
            : i && typeof i === "object" && "message" in i
              ? fmt((i as { message: string }).message)
              : "Unknown error",
        )
        .join(", ");
    if (typeof issues === "object" && "message" in issues)
      return fmt((issues as { message: string }).message);
    return fmt(issues as string);
  };
}

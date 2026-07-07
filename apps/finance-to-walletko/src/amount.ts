export function decimalStringToCents(decimal: string): number {
  const trimmed = decimal.trim();
  const negative = trimmed.startsWith("-");
  const unsigned = negative ? trimmed.slice(1) : trimmed;
  const [whole, fraction = ""] = unsigned.split(".");
  const fractionPadded = (fraction + "00").slice(0, 2);
  const cents = Number(whole || "0") * 100 + Number(fractionPadded);
  return negative ? -cents : cents;
}

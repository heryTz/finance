import { parseArgs } from "node:util";

export function parseCliArgs(argv: string[]): {
  financeUrl: string;
  walletkoUrl: string;
} {
  const { values } = parseArgs({
    args: argv,
    options: {
      finance: { type: "string" },
      walletko: { type: "string" },
    },
  });

  if (!values.finance || !values.walletko) {
    throw new Error("Usage: migrate --finance=<db_url> --walletko=<db_url>");
  }

  return { financeUrl: values.finance, walletkoUrl: values.walletko };
}

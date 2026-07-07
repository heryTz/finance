import { parseCliArgs } from "./args";
import { migrate } from "./migrate";

async function main() {
  const { financeUrl, walletkoUrl } = parseCliArgs(process.argv.slice(2));
  const summary = await migrate({ financeUrl, walletkoUrl });
  console.log("Migration complete:");
  console.log(JSON.stringify(summary, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });

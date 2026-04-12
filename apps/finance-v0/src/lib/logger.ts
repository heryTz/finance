export function logError(error: unknown) {
  console.log(
    `ERROR: ${new Date().toISOString()} =>`,
    (error as Error)?.message,
    (error as Error)?.stack,
  );
}

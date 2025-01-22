export function logError(error: unknown) {
  console.log(`ERROR: ${new Date().toISOString()} =>`, error);
}

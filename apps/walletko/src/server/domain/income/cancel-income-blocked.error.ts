export type BlockingPot = { name: string; shortfall: number };

export class CancelIncomeBlockedError extends Error {
  constructor(public readonly pots: BlockingPot[]) {
    super("Cancelling this income would leave one or more pots negative.");
    this.name = "CancelIncomeBlockedError";
  }
}

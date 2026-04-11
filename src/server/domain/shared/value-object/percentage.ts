export class Percentage {
  constructor(readonly value: number) {
    if (value < 0 || value > 100) {
      throw new Error("Percentage must be between 0 and 100");
    }
  }

  get rate() {
    return this.value / 100;
  }
}

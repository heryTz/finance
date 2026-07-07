// Validates non-empty only — hex format is enforced at the UI layer by <input type="color">
export class Color {
  readonly value: string;

  constructor(raw: string) {
    const trimmed = raw.trim();
    if (trimmed === "") throw new Error("Color should not be empty");
    this.value = trimmed;
  }
}

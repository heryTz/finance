export class Name {
  readonly value: string;

  constructor(raw: string) {
    const trimmed = raw.trim();
    if (trimmed === "") throw new Error("Name should not be empty");
    this.value = trimmed;
  }
}

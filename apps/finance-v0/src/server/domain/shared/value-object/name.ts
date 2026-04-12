export class Name {
  constructor(readonly value: string) {
    if (value === "") {
      throw new Error("Name should not be empty");
    }
  }
}

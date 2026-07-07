export class Datetime {
  private date: Date;

  constructor(input: Date | string) {
    const d = new Date(input);
    if (Number.isNaN(d.getTime())) {
      throw new Error("Invalid date");
    }
    this.date = d;
  }

  get value() {
    return this.date;
  }

  static now() {
    return new Datetime(new Date());
  }
}

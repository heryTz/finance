import { createId, isCuid } from "@paralleldrive/cuid2";

export class Id {
  private _value: string;
  constructor(existing: string) {
    if (!isCuid(existing)) throw new Error("Id value is invalid Cuid");
    this._value = existing;
  }

  static generate() {
    return new Id(createId());
  }

  isEqual(other: Id) {
    return this._value === other._value;
  }

  get value() {
    return this._value;
  }
}

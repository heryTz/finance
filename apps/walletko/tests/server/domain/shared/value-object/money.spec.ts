import { Money } from "src/server/domain/shared/value-object/money";
import { Percentage } from "src/server/domain/shared/value-object/percentage";

describe("money", () => {
  it("throws when negative value", () => {
    expect(() => new Money(-1)).toThrow();
  });

  it("return value", () => {
    const m = new Money(10);
    expect(m.value).toBe(10);
  });

  it("return raw cents", () => {
    const m = new Money(10.33);
    expect(m.rawCents).toBe(1033);
  });

  it("return nearest value (upper)", () => {
    const m = new Money(10.336);
    expect(m.value).toBe(10.33);
  });

  it("return nearest value (lower)", () => {
    const m = new Money(10.334);
    expect(m.value).toBe(10.33);
  });

  it("return nearest cents (upper)", () => {
    const m = new Money(10.336);
    expect(m.rawCents).toBe(1033);
  });

  it("return nearest cents (lower)", () => {
    const m = new Money(10.334);
    expect(m.rawCents).toBe(1033);
  });

  it("add cents", () => {
    const m1 = new Money(10);
    const m2 = new Money(20);
    const total = m1.add(m2);
    expect(total.value).toBe(30.0);
  });

  it("substract cents", () => {
    const m1 = new Money(30);
    const m2 = new Money(10);
    const total = m1.substract(m2);
    expect(total.value).toBe(20.0);
  });

  it("throws when substracting more than available", () => {
    const m1 = new Money(10);
    const m2 = new Money(30);
    expect(() => m1.substract(m2)).toThrow("Insufficient balance");
  });

  it("isLessThan returns true when less", () => {
    const m1 = new Money(10);
    const m2 = new Money(30);
    expect(m1.isLessThan(m2)).toBe(true);
  });

  it("isLessThan returns false when greater", () => {
    const m1 = new Money(30);
    const m2 = new Money(10);
    expect(m1.isLessThan(m2)).toBe(false);
  });

  it("isLessThan returns false when equal", () => {
    const m1 = new Money(10);
    const m2 = new Money(10);
    expect(m1.isLessThan(m2)).toBe(false);
  });

  it("percent of", () => {
    const m1 = new Money(50);
    const m2 = m1.percentOf(new Percentage(25));
    expect(m2.value).toBe(12.5);
  });

  it("percent 30% of 30 amount", () => {
    const m1 = new Money(30);
    const m2 = m1.percentOf(new Percentage(30));
    expect(m2.value).toBe(9);
  });
});

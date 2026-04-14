import { Percentage } from "src/server/domain/shared/value-object/percentage";

describe("percentage", () => {
  it("throws when percentage lower than 0", () => {
    expect(() => new Percentage(-1)).toThrow();
  });

  it("throws when percentage greather than 101", () => {
    expect(() => new Percentage(101)).toThrow();
  });

  it("creates when valid percentage", () => {
    const p = new Percentage(44);
    expect(p.value).toBe(44);
  });

  it("give rate", () => {
    const p = new Percentage(50);
    expect(p.rate).toBe(0.5);
  });
});

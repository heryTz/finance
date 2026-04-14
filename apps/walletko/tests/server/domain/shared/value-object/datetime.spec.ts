import { Datetime } from "src/server/domain/shared/value-object/datetime";

describe("datetime", () => {
  it("throws when invalidate date", () => {
    expect(() => new Datetime("wrong_date")).toThrow();
  });

  it("creates with valid date", () => {
    const nativeDate = new Date("2026-01-01");
    const normalizedDate = new Datetime("2026-01-01");
    expect(normalizedDate.value.toString()).toBe(nativeDate.toString());
  });
});

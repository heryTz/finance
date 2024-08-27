import { getMonthLabel, getMonthRange } from "../stat-util";

describe("stat util", () => {
  it("should return 12 month of 2024 [0..11]", () => {
    const range = getMonthRange({
      from: new Date("2024-01-01"),
      to: new Date("2024-12-31"),
    });
    expect(range).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });

  it("should return 24 month of 2024-2025 [0..23]", () => {
    const range = getMonthRange({
      from: new Date("2024-01-01"),
      to: new Date("2025-12-31"),
    });
    expect(range).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23,
    ]);
  });

  it("month label should with year", () => {
    const label = getMonthLabel({
      monthIndex: 0,
      from: new Date("2024-01-01"),
      to: new Date("2025-12-31"),
    });
    expect(label).toBe("janvier 2024");
  });

  it("month label should without year", () => {
    const label = getMonthLabel({
      monthIndex: 0,
      from: new Date("2024-01-01"),
      to: new Date("2024-12-31"),
    });
    expect(label).toBe("janvier");
  });
});

import dayjs from "dayjs";
import { getMonthLabel, getMonthRange } from "../stat-util";

describe("stat util", () => {
  it("should return 12 month of 2024 [0..11]", () => {
    const range = getMonthRange({
      from: new Date("2024-01-01"),
      to: new Date("2024-12-31"),
      customActualDate: new Date("2024-12-31"),
    });
    expect(range).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });

  it("should return 24 month of 2024-2025 [0..23]", () => {
    const range = getMonthRange({
      from: new Date("2024-01-01"),
      to: new Date("2025-12-31"),
      customActualDate: new Date("2025-12-31"),
    });
    expect(range).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23,
    ]);
  });

  it("should return between March and June month index", () => {
    const range = getMonthRange({
      from: new Date("2024-03-01"),
      to: new Date("2024-06-01"),
      customActualDate: new Date("2024-06-01"),
    });
    expect(range).toEqual([2, 3, 4, 5]);
  });

  it("should return between March index", () => {
    const range = getMonthRange({
      from: new Date("2024-03-01"),
      to: new Date("2024-03-02"),
      customActualDate: new Date("2024-03-02"),
    });
    expect(range).toEqual([2]);
  });

  it("should return between December 2024 and January 2025 month index", () => {
    const range = getMonthRange({
      from: new Date("2024-12-31"),
      to: new Date("2025-01-01"),
      customActualDate: new Date("2025-01-01"),
    });
    expect(range).toEqual([11, 12]);
  });

  it("should return between October 2023 and March 2024 month index", () => {
    const range = getMonthRange({
      from: new Date("2023-10-01"),
      to: new Date("2024-03-01"),
      customActualDate: new Date("2024-03-01"),
    });
    expect(range).toEqual([9, 10, 11, 12, 13, 14]);
  });

  it("should return only month range before or same of the actual month", () => {
    const range = getMonthRange({
      from: dayjs().startOf("year").toDate(),
      to: dayjs().endOf("year").toDate(),
    });
    const actualMonth = dayjs().get("month");
    expect(range).toEqual(Array.from({ length: actualMonth + 1 }, (_, i) => i));
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

  it("août month label", () => {
    const label = getMonthLabel({
      monthIndex: 7,
      from: new Date("2024-08-01"),
      to: new Date("2024-09-31"),
    });
    expect(label).toBe("août");
  });
});

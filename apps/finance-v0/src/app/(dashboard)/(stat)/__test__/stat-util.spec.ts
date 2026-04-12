import dayjs from "dayjs";
import { getMonthLabel, getMonthRange } from "../stat-util";

describe("stat util", () => {
  it("return all month index of 2024", () => {
    const range = getMonthRange({
      from: new Date("2024-01-01"),
      to: new Date("2024-12-31"),
      customActualDate: new Date("2024-12-31"),
    });
    expect(range).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });

  it("return all month index between 2024 and 2025", () => {
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

  it("return all month index between March and June", () => {
    const range = getMonthRange({
      from: new Date("2024-03-01"),
      to: new Date("2024-06-01"),
      customActualDate: new Date("2024-06-01"),
    });
    expect(range).toEqual([2, 3, 4, 5]);
  });

  it("return month index of March", () => {
    const range = getMonthRange({
      from: new Date("2024-03-01"),
      to: new Date("2024-03-02"),
      customActualDate: new Date("2024-03-02"),
    });
    expect(range).toEqual([2]);
  });

  it("return all month index between December 2024 and January 2025", () => {
    const range = getMonthRange({
      from: new Date("2024-12-31"),
      to: new Date("2025-01-01"),
      customActualDate: new Date("2025-01-01"),
    });
    expect(range).toEqual([11, 12]);
  });

  it("return all month index between October 2023 and March 2024", () => {
    const range = getMonthRange({
      from: new Date("2023-10-01"),
      to: new Date("2024-03-01"),
      customActualDate: new Date("2024-03-01"),
    });
    expect(range).toEqual([9, 10, 11, 12, 13, 14]);
  });

  it("return all month index before or same of the current month", () => {
    const range = getMonthRange({
      from: dayjs().startOf("year").toDate(),
      to: dayjs().endOf("year").toDate(),
    });
    const actualMonth = dayjs().get("month");
    expect(range).toEqual(Array.from({ length: actualMonth + 1 }, (_, i) => i));
  });

  it("return month label with year", () => {
    const label = getMonthLabel({
      monthIndex: 0,
      from: new Date("2024-01-01"),
      to: new Date("2025-12-31"),
    });
    expect(label).toBe("janvier 2024");
  });

  it("return month label without year", () => {
    const label = getMonthLabel({
      monthIndex: 0,
      from: new Date("2024-01-01"),
      to: new Date("2024-12-31"),
    });
    expect(label).toBe("janvier");
  });

  it("return Août month label", () => {
    const label = getMonthLabel({
      monthIndex: 7,
      from: new Date("2024-08-01"),
      to: new Date("2024-09-31"),
    });
    expect(label).toBe("août");
  });
});

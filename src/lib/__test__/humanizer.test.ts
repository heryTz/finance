import { humanAmount, humanDate } from "@/lib/humanizer";

describe("humanAmount", () => {
  it("formats the number with 2 decimal places", () => {
    const result = humanAmount(1234.5678);
    expect(result).toBe("1,234.57");
  });

  it("formats the number with minimum and maximum fraction digits as 2", () => {
    const result = humanAmount(9876.54321);
    expect(result).toBe("9,876.54");
  });
});

describe("humanDate", () => {
  it("returns an empty string if the date is null", () => {
    const result = humanDate(null);
    expect(result).toBe("");
  });

  it("formats the date in the 'DD/MM/YYYY' format", () => {
    const result = humanDate(new Date("2022-01-01"));
    expect(result).toBe("01/01/2022");
  });
});

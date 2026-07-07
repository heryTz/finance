import { humanizeFromCent } from "src/shared/hooks/use-format-currency";

describe("humanizeFromCent", () => {
  it("formats values under 1 000 Ar as plain", () => {
    expect(humanizeFromCent(50_000)).toBe("500 Ar");
  });

  it("formats values >= 1 000 Ar with K suffix", () => {
    expect(humanizeFromCent(4_500_000)).toBe("45K Ar");
  });

  it("formats values >= 1 000 000 Ar with M suffix", () => {
    expect(humanizeFromCent(124_000_000)).toBe("1.24M Ar");
  });

  it("strips trailing zeros after decimal", () => {
    expect(humanizeFromCent(200_000_000)).toBe("2M Ar");
    expect(humanizeFromCent(150_000_000)).toBe("1.5M Ar");
  });

  it("handles zero", () => {
    expect(humanizeFromCent(0)).toBe("0 Ar");
  });
});

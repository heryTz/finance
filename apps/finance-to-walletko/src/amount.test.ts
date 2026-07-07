import { describe, expect, it } from "vitest";
import { decimalStringToCents } from "./amount";

describe("decimalStringToCents", () => {
  it("converts two-decimal strings", () => {
    expect(decimalStringToCents("123.45")).toBe(12345);
  });
  it("converts integers with no decimal point", () => {
    expect(decimalStringToCents("123")).toBe(12300);
  });
  it("pads a single fractional digit", () => {
    expect(decimalStringToCents("1.5")).toBe(150);
  });
  it("handles leading-zero cents", () => {
    expect(decimalStringToCents("0.05")).toBe(5);
  });
  it("handles zero", () => {
    expect(decimalStringToCents("0")).toBe(0);
  });
  it("handles large values without float drift", () => {
    expect(decimalStringToCents("1000000.99")).toBe(100000099);
  });
  it("handles negative values", () => {
    expect(decimalStringToCents("-10.00")).toBe(-1000);
  });
});

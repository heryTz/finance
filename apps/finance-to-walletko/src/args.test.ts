import { describe, expect, it } from "vitest";
import { parseCliArgs } from "./args";

describe("parseCliArgs", () => {
  it("parses --flag=value form", () => {
    expect(
      parseCliArgs(["--finance=postgres://f", "--walletko=postgres://w"]),
    ).toEqual({
      financeUrl: "postgres://f",
      walletkoUrl: "postgres://w",
    });
  });

  it("parses --flag value form", () => {
    expect(
      parseCliArgs(["--finance", "postgres://f", "--walletko", "postgres://w"]),
    ).toEqual({ financeUrl: "postgres://f", walletkoUrl: "postgres://w" });
  });

  it("throws when --finance is missing", () => {
    expect(() => parseCliArgs(["--walletko=postgres://w"])).toThrow(/Usage/);
  });

  it("throws when --walletko is missing", () => {
    expect(() => parseCliArgs(["--finance=postgres://f"])).toThrow(/Usage/);
  });
});

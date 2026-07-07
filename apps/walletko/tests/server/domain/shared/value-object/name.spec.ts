import { Name } from "src/server/domain/shared/value-object/name";

describe("name", () => {
  it("throws when empty", () => {
    expect(() => new Name("")).toThrow("Name should not be empty");
  });

  it("throws when whitespace-only", () => {
    expect(() => new Name("   ")).toThrow("Name should not be empty");
  });

  it("trims surrounding whitespace", () => {
    expect(new Name("  Alice  ").value).toBe("Alice");
  });

  it("creates when valid", () => {
    const p = new Name("Project 2026");
    expect(p.value).toBe("Project 2026");
  });
});

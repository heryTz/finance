import { Name } from "src/server/domain/shared/value-object/name";

describe("name", () => {
  it("throws when empty", () => {
    expect(() => new Name("")).toThrow();
  });

  it("creates when valid", () => {
    const p = new Name("Project 2026");
    expect(p.value).toBe("Project 2026");
  });
});

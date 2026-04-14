import { createId } from "@paralleldrive/cuid2";
import { Id } from "src/server/domain/shared/value-object/id";

describe("id", () => {
  it("throws when invalid cuid id", () => {
    expect(() => new Id("123")).toThrow();
  });

  it("create with existing value", () => {
    const cuid = createId();
    const id = new Id(cuid);
    expect(id.value).toBe(cuid);
  });

  it("create default", () => {
    const id = Id.generate();
    expect(id.value).toBeDefined();
  });

  it("equals", () => {
    const cuid = createId();
    const id1 = new Id(cuid);
    const id2 = new Id(cuid);
    expect(id1.isEqual(id2)).toBe(true);
  });
});

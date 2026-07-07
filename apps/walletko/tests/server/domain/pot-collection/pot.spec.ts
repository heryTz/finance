import { Color } from "src/server/domain/shared/value-object/color";
import { Name } from "src/server/domain/shared/value-object/name";
import { makePot } from "src/server/domain/pot-collection/pot.factory";

describe("Pot", () => {
  it("changeColor updates color and sets updatedAt", () => {
    const pot = makePot({ color: new Color("#888888") });
    pot.changeColor(new Color("#ff0000"));
    expect(pot.data.color.value).toBe("#ff0000");
    expect(pot.data.updatedAt).not.toBeNull();
  });

  it("changeName updates name and sets updatedAt", () => {
    const pot = makePot({ name: new Name("Savings") });
    pot.changeName(new Name("Holiday"));
    expect(pot.data.name.value).toBe("Holiday");
    expect(pot.data.updatedAt).not.toBeNull();
  });

  it("archive() sets archivedAt", () => {
    const pot = makePot({});
    expect(pot.data.archivedAt).toBeNull();
    pot.archive();
    expect(pot.data.archivedAt).not.toBeNull();
  });
});

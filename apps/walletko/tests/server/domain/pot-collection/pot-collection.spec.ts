import { Id } from "src/server/domain/shared/value-object/id";
import { Name } from "src/server/domain/shared/value-object/name";
import { Percentage } from "src/server/domain/shared/value-object/percentage";
import { Color } from "src/server/domain/shared/value-object/color";
import { PotCollection } from "src/server/domain/pot-collection/pot-collection";
import { makePot } from "src/server/domain/pot-collection/pot.factory";

describe("pot collection", () => {
  it("throws when pot is empty", () => {
    expect(() => new PotCollection({ pots: [] })).toThrow();
  });

  it("throws when percentage sum is not 100 after add pot", () => {
    const defaultPot = makePot({ percentage: new Percentage(100) });
    const b = new PotCollection({ pots: [defaultPot] });
    expect(() =>
      b.addPot(
        new Name("Pot"),
        new Percentage(11),
        new Color("#888888"),
        [{ id: defaultPot.data.id, percentage: new Percentage(90) }],
        Id.generate(),
      ),
    ).toThrow();
  });

  it("create pot with valid data", () => {
    const defaultPot = makePot({ percentage: new Percentage(100) });
    const b = new PotCollection({ pots: [defaultPot] });
    const createdPot = b.addPot(
      new Name("Pot"),
      new Percentage(40),
      new Color("#888888"),
      [{ id: defaultPot.data.id, percentage: new Percentage(60) }],
      Id.generate(),
    );
    expect(createdPot.data.name.value).toBe("Pot");
    expect(createdPot.data.color.value).toBe("#888888");
    expect(createdPot.data.isDefault).toBe(false);
  });

  it("throws when add pot and existing and incoming pots does not match", () => {
    const existingPot = makePot({ percentage: new Percentage(100) });
    const b = new PotCollection({ pots: [existingPot] });
    expect(() =>
      b.addPot(
        new Name("Pot"),
        new Percentage(40),
        new Color("#888888"),
        [{ id: Id.generate(), percentage: new Percentage(60) }],
        Id.generate(),
      ),
    ).toThrow();
  });

  it("throws when percentage sum is not 100 after adjust repartition", () => {
    const pot1 = makePot({ percentage: new Percentage(50) });
    const pot2 = makePot({ percentage: new Percentage(50) });
    const b = new PotCollection({ pots: [pot1, pot2] });
    expect(() =>
      b.adjustRepartition([
        { id: pot1.data.id, percentage: new Percentage(70) },
        { id: pot2.data.id, percentage: new Percentage(20) },
      ]),
    ).toThrow();
  });

  it("adjust pots repartition", () => {
    const pot1 = makePot({ percentage: new Percentage(50) });
    const pot2 = makePot({ percentage: new Percentage(50) });
    const b = new PotCollection({ pots: [pot1, pot2] });
    b.adjustRepartition([
      { id: pot1.data.id, percentage: new Percentage(70) },
      { id: pot2.data.id, percentage: new Percentage(30) },
    ]);
    const pots = b.potsData;
    expect(
      pots.find((p) => p.data.id.isEqual(pot1.data.id))?.data.percentage.value,
    ).toBe(70);
    expect(
      pots.find((p) => p.data.id.isEqual(pot2.data.id))?.data.percentage.value,
    ).toBe(30);
  });

  describe("archivePot", () => {
    it("throws when pot is not found", () => {
      const pot1 = makePot({ percentage: new Percentage(100) });
      const collection = new PotCollection({ pots: [pot1] });
      expect(() => collection.archivePot(Id.generate(), [])).toThrow(
        "Pot not found",
      );
    });

    it("throws when pot is default", () => {
      const defaultPot = makePot({
        percentage: new Percentage(100),
        isDefault: true,
      });
      const collection = new PotCollection({ pots: [defaultPot] });
      expect(() => collection.archivePot(defaultPot.data.id, [])).toThrow(
        "Cannot archive the default pot",
      );
    });

    it("throws when remaining percentages do not sum to 100", () => {
      const defaultPot = makePot({
        percentage: new Percentage(60),
        isDefault: true,
      });
      const pot2 = makePot({ percentage: new Percentage(40) });
      const collection = new PotCollection({ pots: [defaultPot, pot2] });
      expect(() =>
        collection.archivePot(pot2.data.id, [
          { id: defaultPot.data.id, percentage: new Percentage(80) },
        ]),
      ).toThrow();
    });

    it("throws when a remaining pot is missing from the update", () => {
      const defaultPot = makePot({
        percentage: new Percentage(50),
        isDefault: true,
      });
      const pot2 = makePot({ percentage: new Percentage(30) });
      const pot3 = makePot({ percentage: new Percentage(20) });
      const collection = new PotCollection({ pots: [defaultPot, pot2, pot3] });
      expect(() =>
        collection.archivePot(pot3.data.id, [
          { id: defaultPot.data.id, percentage: new Percentage(100) },
        ]),
      ).toThrow("All remaining pots must have a new percentage");
    });

    it("archives the last non-default pot, leaving only the default pot", () => {
      const defaultPot = makePot({
        percentage: new Percentage(50),
        isDefault: true,
      });
      const pot2 = makePot({ percentage: new Percentage(50) });
      const collection = new PotCollection({ pots: [defaultPot, pot2] });

      collection.archivePot(pot2.data.id, [
        { id: defaultPot.data.id, percentage: new Percentage(100) },
      ]);

      const deleted = collection.potsData.find((p) =>
        p.data.id.isEqual(pot2.data.id),
      );
      expect(deleted?.data.archivedAt).not.toBeNull();
      expect(defaultPot.data.percentage.value).toBe(100);
    });

    it("sets archivedAt on the archived pot and adjusts remaining percentages", () => {
      const defaultPot = makePot({
        percentage: new Percentage(40),
        isDefault: true,
      });
      const pot2 = makePot({ percentage: new Percentage(30) });
      const pot3 = makePot({ percentage: new Percentage(30) });
      const collection = new PotCollection({ pots: [defaultPot, pot2, pot3] });

      collection.archivePot(pot2.data.id, [
        { id: defaultPot.data.id, percentage: new Percentage(50) },
        { id: pot3.data.id, percentage: new Percentage(50) },
      ]);

      const pots = collection.potsData;
      const deleted = pots.find((p) => p.data.id.isEqual(pot2.data.id));
      const remaining = pots.find((p) => p.data.id.isEqual(defaultPot.data.id));

      expect(deleted?.data.archivedAt).not.toBeNull();
      expect(remaining?.data.percentage.value).toBe(50);
    });
  });
});

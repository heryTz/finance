import { Id } from "../shared/value-object/id";
import { Name } from "../shared/value-object/name";
import { Percentage } from "../shared/value-object/percentage";
import { PotCollection } from "./pot-collection";
import { makePot } from "./pot.factory";

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
      [{ id: defaultPot.data.id, percentage: new Percentage(60) }],
      Id.generate(),
    );
    expect(createdPot.data.name.value).toBe("Pot");
  });

  it("throws when add pot and existing and incoming pots does not match", () => {
    const existingPot = makePot({ percentage: new Percentage(100) });
    const b = new PotCollection({ pots: [existingPot] });
    expect(() =>
      b.addPot(
        new Name("Pot"),
        new Percentage(40),
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
});

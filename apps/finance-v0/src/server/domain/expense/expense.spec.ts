import { makePot, makePotSnapshot } from "../pot-collection/pot.factory";
import { Id } from "../shared/value-object/id";
import { Money } from "../shared/value-object/money";
import { Name } from "../shared/value-object/name";
import { Expense } from "./expense";

describe("expense", () => {
  it("throws when empty pots provided", () => {
    const selectedPot = makePot({});
    expect(() =>
      Expense.create({
        name: new Name("Expense"),
        selectedPots: [{ id: selectedPot.data.id, amount: new Money(10) }],
        pots: [],
        tags: [],
      }),
    ).toThrow();
  });

  it("throws when empty selected pots provided", () => {
    const potaSnapshot = makePotSnapshot({});
    expect(() =>
      Expense.create({
        name: new Name("Expense"),
        selectedPots: [],
        pots: [potaSnapshot],
        tags: [],
      }),
    ).toThrow();
  });

  it("throws when a selected pot does not exist", () => {
    const potSnapshot = makePotSnapshot({});
    expect(() =>
      Expense.create({
        name: new Name("Expense"),
        selectedPots: [{ id: Id.generate(), amount: new Money(10) }],
        pots: [potSnapshot],
        tags: [],
      }),
    ).toThrow();
  });

  it("throws when a selected pot has insufficient balance", () => {
    const potSnapshot = makePotSnapshot({ balance: new Money(100) });
    expect(() =>
      Expense.create({
        name: new Name("Expense"),
        selectedPots: [
          { id: potSnapshot.data.pot.data.id, amount: new Money(101) },
        ],
        pots: [potSnapshot],
        tags: [],
      }),
    ).toThrow();
  });
});

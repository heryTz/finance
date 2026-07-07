import {
  makePot,
  makePotSnapshot,
} from "src/server/domain/pot-collection/pot.factory";
import { Id } from "src/server/domain/shared/value-object/id";
import { Money } from "src/server/domain/shared/value-object/money";
import { Name } from "src/server/domain/shared/value-object/name";
import { Expense } from "src/server/domain/expense/expense";

const userId = Id.generate();

describe("expense", () => {
  it("throws when empty pots provided", () => {
    const selectedPot = makePot({});
    expect(() =>
      Expense.create({
        name: new Name("Expense"),
        selectedPots: [{ id: selectedPot.data.id, amount: new Money(10) }],
        pots: [],
        tags: [],
        userId,
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
        userId,
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
        userId,
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
        userId,
      }),
    ).toThrow();
  });

  it("allows spending the exact pot balance", () => {
    const potSnapshot = makePotSnapshot({ balance: new Money(100) });
    const expense = Expense.create({
      name: new Name("Expense"),
      selectedPots: [
        { id: potSnapshot.data.pot.data.id, amount: new Money(100) },
      ],
      pots: [potSnapshot],
      tags: [],
      userId,
    });
    expect(expense.data.amount.value).toBe(100);
    expect(expense.data.allocations[0].data.amount.value).toBe(100);
  });
});

import { makePot } from "src/server/domain/pot-collection/pot.factory";
import { Id } from "src/server/domain/shared/value-object/id";
import { Money } from "src/server/domain/shared/value-object/money";
import { Name } from "src/server/domain/shared/value-object/name";
import { Percentage } from "src/server/domain/shared/value-object/percentage";
import { Income } from "src/server/domain/income/income";

const userId = Id.generate();

describe("income", () => {
  it("allocations sum equals income amount", () => {
    const pots = [
      makePot({ percentage: new Percentage(20) }),
      makePot({ percentage: new Percentage(80) }),
    ];
    const income = Income.create({
      name: new Name("name"),
      amount: new Money(1000),
      tags: [],
      pots,
      userId,
    });

    const allocationSum = income.data.allocations.reduce((acc, cur) => {
      acc += cur.data.amount.value;
      return acc;
    }, 0);

    expect(allocationSum).toBe(income.data.amount.value);
  });

  it("throws when empty pots provided", () => {
    expect(() =>
      Income.create({
        name: new Name("name"),
        amount: new Money(10),
        pots: [],
        tags: [],
        userId,
      }),
    ).toThrow();
  });
});

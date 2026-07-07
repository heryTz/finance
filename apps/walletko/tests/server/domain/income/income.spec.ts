import { makePot } from "src/server/domain/pot-collection/pot.factory";
import { Datetime } from "src/server/domain/shared/value-object/datetime";
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

  it("uses provided createdAt when given", () => {
    const customDate = new Date("2025-01-15");
    const income = Income.create({
      name: new Name("Salary"),
      amount: new Money(1000),
      tags: [],
      pots: [makePot({ percentage: new Percentage(100) })],
      userId,
      createdAt: new Datetime(customDate),
    });
    expect(income.data.createdAt.value).toEqual(customDate);
  });

  it("update changes name, date, and tags", () => {
    const pots = [makePot({ percentage: new Percentage(100) })];
    const income = Income.create({
      name: new Name("Old Name"),
      amount: new Money(500),
      tags: [],
      pots,
      userId,
    });

    const newDate = new Date("2025-03-01");
    income.update({
      name: new Name("New Name"),
      date: new Datetime(newDate),
      tags: [],
    });

    expect(income.data.name.value).toBe("New Name");
    expect(income.data.createdAt.value).toEqual(newDate);
    expect(income.data.updatedAt).not.toBeNull();
  });

  it("update does not change amount or allocations", () => {
    const pots = [makePot({ percentage: new Percentage(100) })];
    const income = Income.create({
      name: new Name("Salary"),
      amount: new Money(500),
      tags: [],
      pots,
      userId,
    });

    income.update({
      name: new Name("Updated"),
      date: Datetime.now(),
      tags: [],
    });

    expect(income.data.amount.value).toBe(500);
    expect(income.data.allocations.length).toBe(1);
    expect(income.data.allocations[0].data.amount.value).toBe(500);
  });
});

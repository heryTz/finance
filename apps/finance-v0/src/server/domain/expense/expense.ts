import { PotSnapshot } from "../pot-collection/value-object/pot-snapshot";
import { Datetime } from "../shared/value-object/datetime";
import { Id } from "../shared/value-object/id";
import { Money } from "../shared/value-object/money";
import { Name } from "../shared/value-object/name";
import { Tag } from "../tag/tag";
import { ExpenseAllocation } from "./expense-allocation";

type ExpenseProps = {
  id: Id;
  name: Name;
  amount: Money;
  userId: Id;
  createdAt: Datetime;
  updatedAt: Datetime | null;
  tags: Tag[];
  allocations: ExpenseAllocation[];
};

export class Expense {
  private props: ExpenseProps;

  constructor(params: ExpenseProps) {
    this.props = params;
  }

  static create(params: {
    name: Name;
    tags: Tag[];
    selectedPots: { id: Id; amount: Money }[];
    pots: PotSnapshot[];
    userId: Id;
  }) {
    if (!params.pots.length) {
      throw new Error("Empty pots provided");
    }
    if (!params.selectedPots.length) {
      throw new Error("Empty selected post provided");
    }
    const potNotFound = params.selectedPots.find(
      (s) => !params.pots.find((p) => p.data.pot.data.id.isEqual(s.id)),
    );
    if (potNotFound) {
      throw new Error(`Pot not ${potNotFound.id.value} found`);
    }
    const potInsufficientBalance = params.selectedPots.find((s) => {
      const cur = params.pots.find((p) => p.data.pot.data.id.isEqual(s.id));
      if (!cur) return false;
      return cur.data.balance.isLessOrEqualThan(s.amount);
    });
    if (potInsufficientBalance) {
      throw new Error(
        `Pot ${potInsufficientBalance.id.value} has insufficient balance`,
      );
    }

    const expenseId = Id.generate();
    const allocations = params.selectedPots.map(
      (el) =>
        new ExpenseAllocation({
          id: Id.generate(),
          expenseId,
          potId: el.id,
          amount: el.amount,
          createdAt: Datetime.now(),
          updatedAt: null,
        }),
    );
    const sumAmount = params.selectedPots.reduce((acc, cur) => {
      acc += cur.amount.value;
      return acc;
    }, 0);
    return new Expense({
      id: expenseId,
      name: params.name,
      amount: new Money(sumAmount),
      userId: params.userId,
      tags: params.tags,
      allocations,
      createdAt: Datetime.now(),
      updatedAt: null,
    });
  }

  get data() {
    return { ...this.props };
  }
}

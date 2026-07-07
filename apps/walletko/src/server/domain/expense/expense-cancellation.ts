import type { Expense } from "src/server/domain/expense/expense";
import { Datetime } from "src/server/domain/shared/value-object/datetime";
import { Id } from "src/server/domain/shared/value-object/id";
import type { Money } from "src/server/domain/shared/value-object/money";
import { Name } from "src/server/domain/shared/value-object/name";

type ExpenseCancellationLine = { potId: Id; amount: Money };

type ExpenseCancellationProps = {
  id: Id;
  cancelsTransactionId: Id;
  name: Name;
  amount: Money;
  userId: Id;
  lines: ExpenseCancellationLine[];
  createdAt: Datetime;
};

export class ExpenseCancellation {
  private props: ExpenseCancellationProps;

  constructor(params: ExpenseCancellationProps) {
    this.props = params;
  }

  static fromExpense(
    expense: Expense,
    resolvePotId: (potId: Id) => Id,
  ): ExpenseCancellation {
    const d = expense.data;
    const byPot = new Map<string, ExpenseCancellationLine>();
    for (const a of d.allocations) {
      const potId = resolvePotId(a.data.potId);
      const existing = byPot.get(potId.value);
      if (existing) {
        existing.amount = existing.amount.add(a.data.amount);
      } else {
        byPot.set(potId.value, { potId, amount: a.data.amount });
      }
    }
    return new ExpenseCancellation({
      id: Id.generate(),
      cancelsTransactionId: d.id,
      name: new Name(`Cancellation: ${d.name.value}`),
      amount: d.amount,
      userId: d.userId,
      lines: [...byPot.values()],
      createdAt: Datetime.now(),
    });
  }

  get data() {
    return { ...this.props };
  }
}

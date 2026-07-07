import type { Income } from "src/server/domain/income/income";
import { Datetime } from "src/server/domain/shared/value-object/datetime";
import { Id } from "src/server/domain/shared/value-object/id";
import type { Money } from "src/server/domain/shared/value-object/money";
import { Name } from "src/server/domain/shared/value-object/name";

type IncomeCancellationLine = { potId: Id; amount: Money };

type IncomeCancellationProps = {
  id: Id;
  cancelsTransactionId: Id;
  name: Name;
  amount: Money;
  userId: Id;
  lines: IncomeCancellationLine[];
  createdAt: Datetime;
};

export class IncomeCancellation {
  private props: IncomeCancellationProps;

  constructor(params: IncomeCancellationProps) {
    this.props = params;
  }

  static fromIncome(income: Income): IncomeCancellation {
    const d = income.data;
    return new IncomeCancellation({
      id: Id.generate(),
      cancelsTransactionId: d.id,
      name: new Name(`Cancellation: ${d.name.value}`),
      amount: d.amount,
      userId: d.userId,
      lines: d.allocations.map((a) => ({
        potId: a.data.potId,
        amount: a.data.amount,
      })),
      createdAt: Datetime.now(),
    });
  }

  get data() {
    return { ...this.props };
  }
}

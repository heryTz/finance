import type { Datetime } from "../shared/value-object/datetime";
import type { Id } from "../shared/value-object/id";
import type { Money } from "../shared/value-object/money";

type ExpenseAllocationProps = {
  id: Id;
  potId: Id;
  expenseId: Id;
  amount: Money;
  createdAt: Datetime;
  updatedAt: Datetime | null;
};

export class ExpenseAllocation {
  private props: ExpenseAllocationProps;

  constructor(params: ExpenseAllocationProps) {
    this.props = params;
  }

  allocate(amount: Money) {
    this.props.amount = amount;
  }

  get data() {
    return { ...this.props };
  }
}

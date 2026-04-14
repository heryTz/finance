import { Datetime } from "../shared/value-object/datetime";
import { Id } from "../shared/value-object/id";
import { Money } from "../shared/value-object/money";
import { ExpenseAllocation } from "./expense-allocation";

export function makeExpenseAllocation(
  override: Partial<ConstructorParameters<typeof ExpenseAllocation>[0]>,
) {
  return new ExpenseAllocation({
    id: Id.generate(),
    potId: Id.generate(),
    expenseId: Id.generate(),
    amount: new Money(10),
    createdAt: new Datetime("2026-01-01"),
    updatedAt: null,
    ...override,
  });
}

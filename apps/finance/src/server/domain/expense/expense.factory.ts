import { Datetime } from "../shared/value-object/datetime";
import { Id } from "../shared/value-object/id";
import { Money } from "../shared/value-object/money";
import { Name } from "../shared/value-object/name";
import { Expense } from "./expense";

export function makeExpense(
  override: Partial<ConstructorParameters<typeof Expense>[0]>,
) {
  return new Expense({
    id: Id.generate(),
    name: new Name("Default"),
    amount: new Money(1000),
    userId: Id.generate(),
    createdAt: new Datetime("2026-01-01"),
    updatedAt: null,
    tags: [],
    allocations: [],
    ...override,
  });
}

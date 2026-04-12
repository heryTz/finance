import { Datetime } from "../shared/value-object/datetime";
import { Id } from "../shared/value-object/id";
import { Money } from "../shared/value-object/money";
import { PotAllocation } from "./pot-allocation";

export function makePotAllocation(
  override: Partial<ConstructorParameters<typeof PotAllocation>[0]>,
) {
  return new PotAllocation({
    id: Id.generate(),
    potId: Id.generate(),
    incomeId: Id.generate(),
    amount: new Money(10),
    createdAt: new Datetime("2026-01-01"),
    updatedAt: null,
    ...override,
  });
}

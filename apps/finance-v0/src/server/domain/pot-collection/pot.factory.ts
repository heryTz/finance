import { Pot } from "./pot";
import { Percentage } from "../shared/value-object/percentage";
import { Datetime } from "../shared/value-object/datetime";
import { Name } from "../shared/value-object/name";
import { Id } from "../shared/value-object/id";
import { PotSnapshot } from "./value-object/pot-snapshot";
import { Money } from "../shared/value-object/money";

export function makePot(
  override: Partial<ConstructorParameters<typeof Pot>[0]>,
) {
  return new Pot({
    id: Id.generate(),
    name: new Name("Default"),
    percentage: new Percentage(10),
    userId: Id.generate(),
    createdAt: new Datetime("2026-01-01"),
    updatedAt: null,
    ...override,
  });
}

export function makePotSnapshot(
  override: Partial<ConstructorParameters<typeof PotSnapshot>[0]>,
) {
  return new PotSnapshot({
    pot: makePot({}),
    balance: new Money(100),
    ...override,
  });
}

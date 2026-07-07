import { Color } from "../shared/value-object/color";
import { Datetime } from "../shared/value-object/datetime";
import { Id } from "../shared/value-object/id";
import { Money } from "../shared/value-object/money";
import { Name } from "../shared/value-object/name";
import { Percentage } from "../shared/value-object/percentage";
import { Pot } from "./pot";
import { PotSnapshot } from "./value-object/pot-snapshot";

export function makePot(
  override: Partial<ConstructorParameters<typeof Pot>[0]>,
) {
  return new Pot({
    id: Id.generate(),
    name: new Name("Default"),
    percentage: new Percentage(10),
    color: new Color("#888888"),
    isDefault: false,
    userId: Id.generate(),
    createdAt: new Datetime("2026-01-01"),
    updatedAt: null,
    archivedAt: null,
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

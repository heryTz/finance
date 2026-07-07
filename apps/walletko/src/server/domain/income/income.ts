import type { Pot } from "../pot-collection/pot";
import { Datetime } from "../shared/value-object/datetime";
import { Id } from "../shared/value-object/id";
import type { Money } from "../shared/value-object/money";
import type { Name } from "../shared/value-object/name";
import type { Tag } from "../tag/tag";
import { PotAllocation } from "./pot-allocation";

type IncomeProps = {
  id: Id;
  name: Name;
  amount: Money;
  userId: Id;
  createdAt: Datetime;
  updatedAt: Datetime | null;
  tags: Tag[];
  allocations: PotAllocation[];
};

export class Income {
  private props: IncomeProps;

  constructor(params: IncomeProps) {
    this.props = params;
  }

  static create(params: {
    name: Name;
    amount: Money;
    tags: Tag[];
    pots: Pot[];
    userId: Id;
    createdAt?: Datetime;
  }) {
    if (!params.pots.length) {
      throw new Error("Empty pots provided");
    }
    const incomeId = Id.generate();
    const allocations = params.pots.map(
      (el) =>
        new PotAllocation({
          id: Id.generate(),
          incomeId,
          potId: el.data.id,
          amount: params.amount.percentOf(el.data.percentage),
          createdAt: Datetime.now(),
          updatedAt: null,
        }),
    );
    return new Income({
      id: incomeId,
      name: params.name,
      amount: params.amount,
      userId: params.userId,
      tags: params.tags,
      allocations,
      createdAt: params.createdAt ?? Datetime.now(),
      updatedAt: null,
    });
  }

  update(params: { name: Name; date: Datetime; tags: Tag[] }): void {
    this.props.name = params.name;
    this.props.createdAt = params.date;
    this.props.tags = params.tags;
    this.props.updatedAt = Datetime.now();
  }

  get data() {
    return { ...this.props };
  }
}

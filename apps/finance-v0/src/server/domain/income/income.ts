import { Pot } from "../pot-collection/pot";
import { Datetime } from "../shared/value-object/datetime";
import { Id } from "../shared/value-object/id";
import { Money } from "../shared/value-object/money";
import { Name } from "../shared/value-object/name";
import { Tag } from "../tag/tag";
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
      createdAt: Datetime.now(),
      updatedAt: null,
    });
  }

  get data() {
    return { ...this.props };
  }
}

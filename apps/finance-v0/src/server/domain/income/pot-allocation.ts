import { Datetime } from "../shared/value-object/datetime";
import { Id } from "../shared/value-object/id";
import { Money } from "../shared/value-object/money";
import { Percentage } from "../shared/value-object/percentage";

type PotAllocationProps = {
  id: Id;
  potId: Id;
  incomeId: Id;
  amount: Money;
  createdAt: Datetime;
  updatedAt: Datetime | null;
};

export class PotAllocation {
  private props: PotAllocationProps;

  constructor(params: PotAllocationProps) {
    this.props = params;
  }

  allocate(amount: Money, percentage: Percentage) {
    this.props.amount = amount.percentOf(percentage);
  }

  get data() {
    return { ...this.props };
  }
}

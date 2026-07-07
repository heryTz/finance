import type { Datetime } from "../shared/value-object/datetime";
import type { Id } from "../shared/value-object/id";
import type { Money } from "../shared/value-object/money";
import type { Name } from "../shared/value-object/name";

type PotTransferProps = {
  id: Id;
  name: Name;
  amount: Money;
  userId: Id;
  fromPotId: Id;
  targets: { potId: Id; amount: Money }[];
  createdAt: Datetime;
};

export class PotTransfer {
  private props: PotTransferProps;

  constructor(params: PotTransferProps) {
    this.props = params;
  }

  get data() {
    return { ...this.props };
  }
}

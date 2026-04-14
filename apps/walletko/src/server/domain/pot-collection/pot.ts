import { Datetime } from "../shared/value-object/datetime";
import { Name } from "../shared/value-object/name";
import { Percentage } from "../shared/value-object/percentage";
import { Id } from "../shared/value-object/id";

type PotProps = {
  id: Id;
  name: Name;
  percentage: Percentage;
  userId: Id;
  createdAt: Datetime;
  updatedAt: Datetime | null;
};

export class Pot {
  private props: PotProps;

  constructor(params: PotProps) {
    this.props = params;
  }

  adjustPercentage(percentage: Percentage) {
    this.props.percentage = percentage;
    this.props.updatedAt = Datetime.now();
  }

  get data() {
    return { ...this.props };
  }
}

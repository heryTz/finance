import type { Color } from "../shared/value-object/color";
import { Datetime } from "../shared/value-object/datetime";
import type { Id } from "../shared/value-object/id";
import type { Name } from "../shared/value-object/name";
import type { Percentage } from "../shared/value-object/percentage";

type PotProps = {
  id: Id;
  name: Name;
  percentage: Percentage;
  color: Color;
  readonly isDefault: boolean;
  userId: Id;
  createdAt: Datetime;
  updatedAt: Datetime | null;
  archivedAt: Datetime | null;
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

  changeColor(color: Color) {
    this.props.color = color;
    this.props.updatedAt = Datetime.now();
  }

  changeName(name: Name) {
    this.props.name = name;
    this.props.updatedAt = Datetime.now();
  }

  archive() {
    this.props.archivedAt = Datetime.now();
  }

  get data() {
    return { ...this.props };
  }
}

import { Datetime } from "../shared/value-object/datetime";
import type { Id } from "../shared/value-object/id";
import type { Name } from "../shared/value-object/name";

type TagProps = {
  id: Id;
  name: Name;
  userId: Id;
  createdAt: Datetime;
  updatedAt: Datetime | null;
};

export class Tag {
  private props: TagProps;

  constructor(params: TagProps) {
    this.props = params;
  }

  rename(newName: Name) {
    this.props.name = newName;
    this.props.updatedAt = Datetime.now();
  }

  get data() {
    return { ...this.props };
  }
}

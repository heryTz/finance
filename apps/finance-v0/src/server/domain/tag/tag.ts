import { Datetime } from "../shared/value-object/datetime";
import { Name } from "../shared/value-object/name";
import { Id } from "../shared/value-object/id";

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

  get data() {
    return { ...this.props };
  }
}

import { Datetime } from "../shared/value-object/datetime";
import type { Id } from "../shared/value-object/id";
import type { Name } from "../shared/value-object/name";

type SavedViewProps = {
  id: Id;
  userId: Id;
  name: Name;
  description: string | null;
  nameFilter: string | null;
  tagIds: string[];
  createdAt: Datetime;
  updatedAt: Datetime | null;
};

export class SavedView {
  private props: SavedViewProps;

  constructor(params: SavedViewProps) {
    this.props = params;
  }

  update(params: {
    name: Name;
    description: string | null;
    nameFilter: string | null;
    tagIds: string[];
  }) {
    this.props.name = params.name;
    this.props.description = params.description;
    this.props.nameFilter = params.nameFilter;
    this.props.tagIds = params.tagIds;
    this.props.updatedAt = Datetime.now();
  }

  get data() {
    return { ...this.props };
  }
}

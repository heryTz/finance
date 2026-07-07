import type { Money } from "../../shared/value-object/money";
import type { Pot } from "../pot";

type PotSnapshotProps = {
  pot: Pot;
  balance: Money;
};

export class PotSnapshot {
  private props: PotSnapshotProps;

  constructor(params: PotSnapshotProps) {
    this.props = params;
  }

  get data() {
    return { ...this.props };
  }
}

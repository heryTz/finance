import { Datetime } from "../shared/value-object/datetime";
import { Id } from "../shared/value-object/id";
import { Name } from "../shared/value-object/name";
import { Percentage } from "../shared/value-object/percentage";
import { Pot } from "./pot";

export class PotCollection {
  private pots: Pot[];

  constructor(params: { pots: Pot[] }) {
    if (params.pots.length === 0)
      throw new Error("Cannot create pot collection with empty pot");
    this.pots = params.pots;
  }

  addPot(
    name: Name,
    percentage: Percentage,
    otherPots: { id: Id; percentage: Percentage }[],
    userId: Id,
  ) {
    const existingPotNotInUpdate = this.pots.find(
      (p) => otherPots.find((o) => p.data.id.isEqual(o.id)) === undefined,
    );
    if (existingPotNotInUpdate) {
      throw new Error("All existing should be adjusted");
    }

    this.validatePercentage([{ percentage }, ...otherPots]);
    this.pots.forEach((el) => {
      const update = otherPots.find((o) => o.id.isEqual(el.data.id));
      if (!update) return;
      el.adjustPercentage(update.percentage);
    });

    const newPot = new Pot({
      id: Id.generate(),
      name,
      percentage,
      userId,
      createdAt: Datetime.now(),
      updatedAt: null,
    });
    this.pots.push(newPot);

    return newPot;
  }

  adjustRepartition(potUpdate: { id: Id; percentage: Percentage }[]) {
    this.validatePercentage(potUpdate);
    this.pots.forEach((el) => {
      const update = potUpdate.find((o) => o.id.isEqual(el.data.id));
      if (!update) return;
      el.adjustPercentage(update.percentage);
    });
  }

  get potsData() {
    return this.pots;
  }

  private validatePercentage(pots: { percentage: Percentage }[]) {
    const percentSum = pots.reduce(
      (acc, cur) => (acc += cur.percentage.value),
      0,
    );
    if (percentSum !== 100) {
      throw new Error("Percentage should equal to 100");
    }
  }
}

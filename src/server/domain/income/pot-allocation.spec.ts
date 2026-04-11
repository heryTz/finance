import { Money } from "../shared/value-object/money";
import { Percentage } from "../shared/value-object/percentage";
import { makePotAllocation } from "./pot-allocation.factory";

describe("pot allocation", () => {
  it("adjust amount", () => {
    const pa = makePotAllocation({});
    pa.allocate(new Money(30), new Percentage(30));
    expect(pa.data.amount.value).toBe(9);
  });
});

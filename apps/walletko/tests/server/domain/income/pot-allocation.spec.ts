import { Money } from "src/server/domain/shared/value-object/money";
import { Percentage } from "src/server/domain/shared/value-object/percentage";
import { makePotAllocation } from "src/server/domain/income/pot-allocation.factory";

describe("pot allocation", () => {
  it("adjust amount", () => {
    const pa = makePotAllocation({});
    pa.allocate(new Money(30), new Percentage(30));
    expect(pa.data.amount.value).toBe(9);
  });
});

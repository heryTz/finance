import { Money } from "../shared/value-object/money";
import { makeExpenseAllocation } from "./expense-allocation.factory";

describe("expense allocation", () => {
  it("adjust amount", () => {
    const pa = makeExpenseAllocation({});
    pa.allocate(new Money(30));
    expect(pa.data.amount.value).toBe(30);
  });
});

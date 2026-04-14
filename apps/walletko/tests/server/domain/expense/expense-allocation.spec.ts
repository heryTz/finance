import { Money } from "src/server/domain/shared/value-object/money";
import { makeExpenseAllocation } from "src/server/domain/expense/expense-allocation.factory";

describe("expense allocation", () => {
  it("adjust amount", () => {
    const pa = makeExpenseAllocation({});
    pa.allocate(new Money(30));
    expect(pa.data.amount.value).toBe(30);
  });
});

import { FinanceType } from "@/entity";
import { Finance } from "@prisma/client";
import { bilanGlobal } from "../finance-stat";
import { Decimal } from "@prisma/client/runtime/library";

describe("bilanGlobal", () => {
  it("calculates revenue and depense correctly", () => {
    const finances: Finance[] = [
      {
        id: "1",
        label: "Finance 1",
        type: FinanceType.revenue,
        amount: new Decimal("100"),
        userId: null,
        createdAt: new Date(),
        updatedAt: null,
      },
      {
        id: "2",
        label: "Finance 2",
        type: FinanceType.revenue,
        amount: new Decimal("200"),
        userId: null,
        createdAt: new Date(),
        updatedAt: null,
      },
      {
        id: "3",
        label: "Finance 3",
        type: FinanceType.depense,
        amount: new Decimal("50"),
        userId: null,
        createdAt: new Date(),
        updatedAt: null,
      },
      {
        id: "4",
        label: "Finance 4",
        type: FinanceType.depense,
        amount: new Decimal("75"),
        userId: null,
        createdAt: new Date(),
        updatedAt: null,
      },
    ];

    const result = bilanGlobal(finances);

    expect(result.revenue).toBe(300);
    expect(result.depense).toBe(125);
  });
});

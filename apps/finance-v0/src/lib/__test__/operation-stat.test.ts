import { OperationType } from "@/entity/operation";
import { Operation } from "@prisma/client";
import { bilanGlobal } from "../operation-stat";
import { Decimal } from "@prisma/client/runtime/library";

describe("bilanGlobal", () => {
  it("calculates revenue and depense correctly", () => {
    const operations: Operation[] = [
      {
        id: "1",
        label: "Operation 1",
        type: OperationType.revenue,
        amount: new Decimal("100"),
        userId: null,
        createdAt: new Date(),
        updatedAt: null,
      },
      {
        id: "2",
        label: "Operation 2",
        type: OperationType.revenue,
        amount: new Decimal("200"),
        userId: null,
        createdAt: new Date(),
        updatedAt: null,
      },
      {
        id: "3",
        label: "Operation 3",
        type: OperationType.depense,
        amount: new Decimal("50"),
        userId: null,
        createdAt: new Date(),
        updatedAt: null,
      },
      {
        id: "4",
        label: "Operation 4",
        type: OperationType.depense,
        amount: new Decimal("75"),
        userId: null,
        createdAt: new Date(),
        updatedAt: null,
      },
    ];

    const result = bilanGlobal(operations);

    expect(result.revenue).toBe(300);
    expect(result.depense).toBe(125);
  });
});

import { buildSaveOperationInput } from "@/lib/factory";
import { createOperation } from "../../operation/operation-service";
import { createUser } from "../../user/user-service";
import { OperationType } from "@/entity";
import { getStats } from "../stat-service";
import dayjs from "dayjs";
import { statData } from "../stat-util";

describe("stat service", () => {
  it("can only view my stat", async () => {
    const user1 = await createUser({ email: "user1@example.com" });
    const user2 = await createUser({ email: "user2@example.com" });
    await createOperation(
      user1.id,
      buildSaveOperationInput({ type: OperationType.revenue }),
    );
    const user2Stat = await getStats(user2.id);
    expect(JSON.stringify(user2Stat.datasets)).toBe(
      JSON.stringify([
        {
          label: statData.incomePerMonth.label,
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          label: statData.expensePerMonth.label,
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          label: statData.totalProfit.label,
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ]),
    );
  });

  it("show stats", async () => {
    const user = await createUser({ email: "user1@example.com" });
    const createdAtMarch = dayjs().set("month", 2);
    const createdAtApril = dayjs().set("month", 3);
    const incomes = [
      buildSaveOperationInput({
        type: OperationType.revenue,
        createdAt: createdAtMarch.toISOString(),
        amount: 30,
      }),
      buildSaveOperationInput({
        type: OperationType.revenue,
        createdAt: createdAtMarch.toISOString(),
        amount: 40,
      }),
      buildSaveOperationInput({
        type: OperationType.revenue,
        createdAt: createdAtApril.toISOString(),
        amount: 20,
      }),
    ];
    const expenses = [
      buildSaveOperationInput({
        type: OperationType.depense,
        createdAt: createdAtMarch.toISOString(),
        amount: 10,
      }),
      buildSaveOperationInput({
        type: OperationType.depense,
        createdAt: createdAtMarch.toISOString(),
        amount: 20,
      }),
      buildSaveOperationInput({
        type: OperationType.depense,
        createdAt: createdAtApril.toISOString(),
        amount: 30,
      }),
    ];
    await Promise.all(incomes.map((el) => createOperation(user.id, el)));
    await Promise.all(expenses.map((el) => createOperation(user.id, el)));

    const stats = await getStats(user.id);
    expect(JSON.stringify(stats.datasets)).toBe(
      JSON.stringify([
        {
          label: statData.incomePerMonth.label,
          data: [0, 0, 70, 20, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          label: statData.expensePerMonth.label,
          data: [0, 0, 30, 30, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          label: statData.totalProfit.label,
          data: [0, 0, 40, 30, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ]),
    );
  });
});

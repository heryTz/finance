import { buildSaveFinanceInput } from "@/lib/factory";
import { createFinance } from "../../finance/finance-service";
import { createUser } from "../../user/user-service";
import { FinanceType } from "@/entity";
import { getStats } from "../stat-service";
import dayjs from "dayjs";
import { statData } from "../stat-util";

describe("stat service", () => {
  it("can only view my stat", async () => {
    const user1 = await createUser({ email: "user1@example.com" });
    const user2 = await createUser({ email: "user2@example.com" });
    await createFinance(
      user1.id,
      buildSaveFinanceInput({ type: FinanceType.revenue }),
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
      buildSaveFinanceInput({
        type: FinanceType.revenue,
        createdAt: createdAtMarch.toISOString(),
        amount: 30,
      }),
      buildSaveFinanceInput({
        type: FinanceType.revenue,
        createdAt: createdAtMarch.toISOString(),
        amount: 40,
      }),
      buildSaveFinanceInput({
        type: FinanceType.revenue,
        createdAt: createdAtApril.toISOString(),
        amount: 20,
      }),
    ];
    const expenses = [
      buildSaveFinanceInput({
        type: FinanceType.depense,
        createdAt: createdAtMarch.toISOString(),
        amount: 10,
      }),
      buildSaveFinanceInput({
        type: FinanceType.depense,
        createdAt: createdAtMarch.toISOString(),
        amount: 20,
      }),
      buildSaveFinanceInput({
        type: FinanceType.depense,
        createdAt: createdAtApril.toISOString(),
        amount: 30,
      }),
    ];
    await Promise.all(incomes.map((el) => createFinance(user.id, el)));
    await Promise.all(expenses.map((el) => createFinance(user.id, el)));

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

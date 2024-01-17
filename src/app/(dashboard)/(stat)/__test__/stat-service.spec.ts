import { buildSaveFinanceInput } from "@/lib/factory";
import { createFinance } from "../../finance/finance-service";
import { createUser } from "../../user/user-service";
import { FinanceType } from "@/entity";
import { getStats } from "../stat-service";
import dayjs from "dayjs";

describe("stat service", () => {
  it("can only view my stat", async () => {
    const user1 = await createUser({ email: "user1@example.com" });
    const user2 = await createUser({ email: "user2@example.com" });
    await createFinance(
      user1.id,
      buildSaveFinanceInput({ type: FinanceType.revenue })
    );
    const user2Stat = await getStats(user2.id);
    expect(JSON.stringify(user2Stat.datasets)).toBe(
      JSON.stringify([
        { label: "Revenu", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { label: "Dépense", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { label: "Bénéfice", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      ])
    );
  });

  it("show stats", async () => {
    const user = await createUser({ email: "user1@example.com" });
    const createdAt = dayjs().set("month", 2);
    const income = buildSaveFinanceInput({
      type: FinanceType.revenue,
      createdAt: createdAt.toISOString(),
      amount: 30,
    });
    const expense = buildSaveFinanceInput({
      type: FinanceType.depense,
      createdAt: createdAt.toISOString(),
      amount: 10,
    });
    await createFinance(user.id, income);
    await createFinance(user.id, expense);
    const stats = await getStats(user.id);
    expect(JSON.stringify(stats.datasets)).toBe(
      JSON.stringify([
        {
          label: "Revenu",
          data: [0, 0, income.amount, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          label: "Dépense",
          data: [0, 0, expense.amount, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          label: "Bénéfice",
          data: [0, 0, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
        },
      ])
    );
  });
});

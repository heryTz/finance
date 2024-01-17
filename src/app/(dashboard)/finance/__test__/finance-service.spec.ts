import { createUser } from "../../user/user-service";
import { createFinance, getFinances } from "../finance-service";
import { CreateFinanceInput } from "../finance-dto";
import { FinanceType } from "@/entity";

describe("finance service", () => {
  it("create finance", async () => {
    const user1 = await createUser({ email: "user1@example.com" });
    const input: CreateFinanceInput = {
      label: "Income 1",
      amount: 1000,
      createdAt: new Date().toISOString(),
      tags: ["tag1"],
      type: FinanceType.revenue,
    };
    const finance = await createFinance(user1.id, input);
    expect(finance.label).toBe(input.label);
    expect(finance.amount.toNumber()).toBe(input.amount);
    expect(finance.type).toBe(input.type);
    expect(finance.createdAt.toISOString()).toBe(input.createdAt);
    expect(finance.tags[0].name).toBe(input.tags[0]);
  });

  it("can only view my finance list", async () => {
    const user1 = await createUser({ email: "user1@example.com" });
    const user2 = await createUser({ email: "user2@example.com" });
    await createFinance(user1.id, {
      label: "Income 2",
      amount: 1000,
      createdAt: new Date().toISOString(),
      tags: [],
      type: FinanceType.revenue,
    });

    const user2Finances = await getFinances(user2.id, {});
    const financeOfOtherUser = user2Finances.results.find(
      (el) => el.userId !== user2.id
    );
    expect(financeOfOtherUser).toBeFalsy();
    expect(user2Finances.stats.expense).toBe(0);
    expect(user2Finances.stats.income).toBe(0);
  });
});

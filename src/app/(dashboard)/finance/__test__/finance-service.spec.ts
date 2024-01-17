import { createUser } from "../../user/user-service";
import {
  createFinance,
  deleteFinance,
  getFinanceById,
  getFinances,
  updateFinance,
} from "../finance-service";
import { FinanceType } from "@/entity";
import { buildSaveFinanceInput } from "@/lib/factory";
import { NotFoundException } from "@/lib/exception";

describe("finance service", () => {
  it("create finance", async () => {
    const user1 = await createUser({ email: "user1@example.com" });
    const input = buildSaveFinanceInput({ tags: ["tag1"] });
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
    await createFinance(user1.id, buildSaveFinanceInput());
    const user2Finances = await getFinances(user2.id, {});
    const financeOfOtherUser = user2Finances.results.find(
      (el) => el.userId !== user2.id
    );
    expect(financeOfOtherUser).toBeFalsy();
    expect(user2Finances.stats.expense).toBe(0);
    expect(user2Finances.stats.income).toBe(0);
  });

  it("can only view my finance item", async () => {
    const user1 = await createUser({ email: "user1@example.com" });
    const user2 = await createUser({ email: "user2@example.com" });
    const user1Finance = await createFinance(user1.id, buildSaveFinanceInput());
    const user1FinanceById = await getFinanceById(user1.id, user1Finance.id);
    expect(user1FinanceById).toBeTruthy();
    await expect(getFinanceById(user2.id, user1Finance.id)).rejects.toThrow(
      NotFoundException
    );
  });

  it("update finance", async () => {
    const user = await createUser({ email: "user1@example.com" });
    const finance = await createFinance(
      user.id,
      buildSaveFinanceInput({ tags: ["tag2"] })
    );
    const update = buildSaveFinanceInput({
      tags: ["tag1"],
      type: FinanceType.depense,
    });
    const financeUpdated = await updateFinance(user.id, finance.id, update);
    expect(financeUpdated.label).toBe(update.label);
    expect(financeUpdated.amount.toNumber()).toBe(update.amount);
    expect(finance.type).toBe(finance.type);
    expect(financeUpdated.tags[0].name).toBe(update.tags[0]);
  });

  it("can only update my finance", async () => {
    const user1 = await createUser({ email: "user1@example.com" });
    const user2 = await createUser({ email: "user2@example.com" });
    const user1Finance = await createFinance(user1.id, buildSaveFinanceInput());
    await expect(
      updateFinance(user2.id, user1Finance.id, buildSaveFinanceInput())
    ).rejects.toThrow(NotFoundException);
  });

  it("delete finance", async () => {
    const user = await createUser({ email: "user1@example.com" });
    const finance = await createFinance(user.id, buildSaveFinanceInput());
    const financeDeleted = await deleteFinance(user.id, finance.id);
    expect(financeDeleted.id).toBe(finance.id);
  });

  it("can only delete my finance", async () => {
    const user1 = await createUser({ email: "user1@example.com" });
    const user2 = await createUser({ email: "user2@example.com" });
    const user1Finance = await createFinance(user1.id, buildSaveFinanceInput());
    await expect(deleteFinance(user2.id, user1Finance.id)).rejects.toThrow();
  });
});

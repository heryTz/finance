import { buildSaveOperationInput } from "@/lib/factory";
import { createOperation } from "../../operation/operation-service";
import { createUser } from "../../user/user-service";
import { OperationType } from "@/entity/operation";
import { getStats } from "../stat-service";
import dayjs from "dayjs";
import { getMonthLabel, getMonthRange } from "../stat-util";

describe("stat service", () => {
  it("can only view my stat", async () => {
    const user1 = await createUser({ email: "user1@example.com" });
    const user2 = await createUser({ email: "user2@example.com" });
    await createOperation(
      user1.id,
      buildSaveOperationInput({ type: OperationType.revenue }),
    );
    const query = {
      startDate: dayjs().startOf("year").toDate(),
      endDate: dayjs().endOf("year").toDate(),
    };
    const user2Stat = await getStats(user2.id, query);
    expect(user2Stat.results).toEqual(
      getMonthRange(query).map((i) => ({
        month: getMonthLabel({ monthIndex: i, ...query }),
        income: 0,
        expense: 0,
        retainedEarnings: 0,
      })),
    );
  });

  it("show stats of year", async () => {
    const user = await createUser({ email: "user1@example.com" });
    const createdAtMarch = dayjs().set("month", 2);
    const createdAtApril = dayjs().set("month", 3);
    const incomes = [
      buildSaveOperationInput({
        type: OperationType.revenue,
        createdAt: createdAtMarch.toDate(),
        amount: 30,
      }),
      buildSaveOperationInput({
        type: OperationType.revenue,
        createdAt: createdAtMarch.toDate(),
        amount: 40,
      }),
      buildSaveOperationInput({
        type: OperationType.revenue,
        createdAt: createdAtApril.toDate(),
        amount: 20,
      }),
    ];
    const expenses = [
      buildSaveOperationInput({
        type: OperationType.depense,
        createdAt: createdAtMarch.toDate(),
        amount: 10,
      }),
      buildSaveOperationInput({
        type: OperationType.depense,
        createdAt: createdAtMarch.toDate(),
        amount: 20,
      }),
      buildSaveOperationInput({
        type: OperationType.depense,
        createdAt: createdAtApril.toDate(),
        amount: 30,
      }),
    ];
    await Promise.all(incomes.map((el) => createOperation(user.id, el)));
    await Promise.all(expenses.map((el) => createOperation(user.id, el)));

    const query = {
      startDate: dayjs().startOf("year").toDate(),
      endDate: dayjs().endOf("year").toDate(),
    };
    const stats = await getStats(user.id, query);
    expect(stats.results).toEqual(
      getMonthRange(query).map((i) => {
        let income = 0;
        let expense = 0;
        let retainedEarnings = 0;
        if (i === 2) {
          income = 70;
          expense = 30;
          retainedEarnings = 40;
        } else if (i === 3) {
          income = 20;
          expense = 30;
          retainedEarnings = 30;
        }
        return {
          month: getMonthLabel({ monthIndex: i, ...query }),
          income,
          expense,
          retainedEarnings,
        };
      }),
    );
  });

  it("show stats of two years", async () => {
    const user = await createUser({ email: "user1@example.com" });
    const createdAtMarch = dayjs().set("month", 2);
    const createdAtAprilNextYear = dayjs().add(1, "year").set("month", 3);
    const incomes = [
      buildSaveOperationInput({
        type: OperationType.revenue,
        createdAt: createdAtMarch.toDate(),
        amount: 30,
      }),
      buildSaveOperationInput({
        type: OperationType.revenue,
        createdAt: createdAtAprilNextYear.toDate(),
        amount: 40,
      }),
    ];
    const expenses = [
      buildSaveOperationInput({
        type: OperationType.depense,
        createdAt: createdAtMarch.toDate(),
        amount: 10,
      }),
      buildSaveOperationInput({
        type: OperationType.depense,
        createdAt: createdAtAprilNextYear.toDate(),
        amount: 20,
      }),
    ];
    await Promise.all(incomes.map((el) => createOperation(user.id, el)));
    await Promise.all(expenses.map((el) => createOperation(user.id, el)));

    const query = {
      startDate: dayjs().startOf("year").toDate(),
      endDate: dayjs().add(1, "year").endOf("year").toDate(),
    };
    const stats = await getStats(user.id, query);
    expect(stats.results).toEqual(
      getMonthRange(query).map((i) => {
        let income = 0;
        let expense = 0;
        let retainedEarnings = 0;
        if (i === 2) {
          income = 30;
          expense = 10;
        } else if (i === 15) {
          income = 40;
          expense = 20;
        }
        if (i >= 2 && i < 15) {
          retainedEarnings = 20;
        } else if (i === 15) {
          retainedEarnings = 40;
        }
        return {
          month: getMonthLabel({ monthIndex: i, ...query }),
          income,
          expense,
          retainedEarnings,
        };
      }),
    );
  });
});

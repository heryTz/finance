import { buildSaveOperationInput } from "@/lib/factory";
import { createOperation } from "../../operation/operation-service";
import { createUser } from "../../user/user-service";
import { OperationType } from "@/entity/operation";
import { getStats } from "../stat-service";
import dayjs from "dayjs";
import { getMonthLabel, getMonthRange } from "../stat-util";
import { SaveOperationInput } from "../../operation/operation-dto";

describe("stat service", () => {
  it("can only view my stat", async () => {
    const user1 = await createUser({ email: "user1@example.com" });
    const user2 = await createUser({ email: "user2@example.com" });
    await createOperation(
      user1.id,
      buildSaveOperationInput({ type: OperationType.revenue }),
    );
    const range = {
      from: dayjs().startOf("year").toDate(),
      to: dayjs().endOf("year").toDate(),
      customActualDate: dayjs().endOf("year").toDate(),
    };
    const user2Stat = await getStats(user2.id, { range });
    expect(user2Stat.results).toEqual(
      getMonthRange(range).map((i) => ({
        month: getMonthLabel({ monthIndex: i, ...range }),
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

    const range = {
      from: dayjs().startOf("year").toDate(),
      to: dayjs().endOf("year").toDate(),
      customActualDate: dayjs().endOf("year").toDate(),
    };
    const stats = await getStats(user.id, { range });
    expect(stats.results).toEqual(
      getMonthRange(range).map((i) => {
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
        } else if (i > 3) {
          retainedEarnings = 30;
        }
        return {
          month: getMonthLabel({ monthIndex: i, ...range }),
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

    const range = {
      from: dayjs().startOf("year").toDate(),
      to: dayjs().add(1, "year").endOf("year").toDate(),
      customActualDate: dayjs().add(1, "year").endOf("year").toDate(),
    };
    const stats = await getStats(user.id, { range });
    expect(stats.results).toEqual(
      getMonthRange(range).map((i) => {
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
        } else if (i >= 15) {
          retainedEarnings = 40;
        }
        return {
          income,
          expense,
          retainedEarnings,
          month: getMonthLabel({ monthIndex: i, ...range }),
        };
      }),
    );
  });

  it("show stat between March and June", async () => {
    const user = await createUser({ email: "user1@example.com" });
    const incomes = [0, 1, 2, 3, 4, 5, 6, 7].map((monthIndex) =>
      buildSaveOperationInput({
        type: OperationType.revenue,
        createdAt: dayjs().set("month", monthIndex).toDate(),
        amount: 20,
      }),
    );
    const expenses = [0, 1, 2, 3, 4, 5, 6, 7].map((monthIndex) =>
      buildSaveOperationInput({
        type: OperationType.depense,
        createdAt: dayjs().set("month", monthIndex).toDate(),
        amount: 10,
      }),
    );
    await Promise.all(incomes.map((el) => createOperation(user.id, el)));
    await Promise.all(expenses.map((el) => createOperation(user.id, el)));

    const range = {
      from: dayjs().set("month", 2).startOf("month").toDate(),
      to: dayjs().set("month", 5).endOf("month").toDate(),
      customActualDate: dayjs().set("month", 5).endOf("month").toDate(),
    };
    const stats = await getStats(user.id, { range });
    expect(stats.results).toEqual([
      {
        month: getMonthLabel({ monthIndex: 2, ...range }),
        income: 20,
        expense: 10,
        retainedEarnings: 30,
      },
      {
        month: getMonthLabel({ monthIndex: 3, ...range }),
        income: 20,
        expense: 10,
        retainedEarnings: 40,
      },
      {
        month: getMonthLabel({ monthIndex: 4, ...range }),
        income: 20,
        expense: 10,
        retainedEarnings: 50,
      },
      {
        month: getMonthLabel({ monthIndex: 5, ...range }),
        income: 20,
        expense: 10,
        retainedEarnings: 60,
      },
    ]);
  });

  it("show stat between for March", async () => {
    const user = await createUser({ email: "user1@example.com" });
    const incomes = [0, 1, 2, 3].map((monthIndex) =>
      buildSaveOperationInput({
        type: OperationType.revenue,
        createdAt: dayjs().set("month", monthIndex).toDate(),
        amount: 20,
      }),
    );
    const expenses = [0, 1, 2, 3].map((monthIndex) =>
      buildSaveOperationInput({
        type: OperationType.depense,
        createdAt: dayjs().set("month", monthIndex).toDate(),
        amount: 10,
      }),
    );
    await Promise.all(incomes.map((el) => createOperation(user.id, el)));
    await Promise.all(expenses.map((el) => createOperation(user.id, el)));

    const range = {
      from: dayjs().set("month", 2).startOf("month").toDate(),
      to: dayjs().set("month", 2).endOf("month").toDate(),
      customActualDate: dayjs().set("month", 2).endOf("month").toDate(),
    };
    const stats = await getStats(user.id, { range });
    expect(stats.results).toEqual([
      {
        month: getMonthLabel({ monthIndex: 2, ...range }),
        income: 20,
        expense: 10,
        retainedEarnings: 30,
      },
    ]);
  });

  it("stat between 31th (Month-1) and 1er (Month) should be all stat between 1er (Month-1) and 31th (Month)", async () => {
    const user = await createUser({ email: "user1@example.com" });
    const actualMonth = dayjs();
    const prevMonth = dayjs().add(-1, "month");
    let data: SaveOperationInput[] = [];
    for (const monthIndex of [
      prevMonth.add(-1, "month").get("month"),
      prevMonth.get("month"),
      actualMonth.get("month"),
      actualMonth.add(1, "month").get("month"),
    ]) {
      data.push(
        buildSaveOperationInput({
          type: OperationType.revenue,
          createdAt: dayjs().set("month", monthIndex).toDate(),
          amount: 20,
        }),
        buildSaveOperationInput({
          type: OperationType.depense,
          createdAt: dayjs().set("month", monthIndex).toDate(),
          amount: 10,
        }),
      );
    }
    await Promise.all(data.map((el) => createOperation(user.id, el)));

    const range = {
      from: prevMonth.endOf("month").toDate(),
      to: actualMonth.startOf("month").toDate(),
    };
    const stats = await getStats(user.id, { range });
    expect(stats.results).toEqual([
      {
        month: getMonthLabel({ monthIndex: prevMonth.get("month"), ...range }),
        income: 20,
        expense: 10,
        retainedEarnings: 20,
      },
      {
        month: getMonthLabel({
          monthIndex: actualMonth.get("month"),
          ...range,
        }),
        income: 20,
        expense: 10,
        retainedEarnings: 30,
      },
    ]);
  });
});

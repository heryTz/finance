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
    const user2Stat = await getStats(user2.id, { range, tags: [] });
    expect(user2Stat.results).toEqual(
      getMonthRange(range).map((i) => ({
        month: getMonthLabel({ monthIndex: i, ...range }),
        income: 0,
        expense: 0,
        balance: 0,
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
    const stats = await getStats(user.id, { range, tags: [] });
    expect(stats.results).toEqual(
      getMonthRange(range).map((i) => {
        let income = 0;
        let expense = 0;
        let balance = 0;
        if (i === 2) {
          income = 70;
          expense = 30;
          balance = 40;
        } else if (i === 3) {
          income = 20;
          expense = 30;
          balance = 30;
        } else if (i > 3) {
          balance = 30;
        }
        return {
          month: getMonthLabel({ monthIndex: i, ...range }),
          income,
          expense,
          balance,
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
    const stats = await getStats(user.id, { range, tags: [] });
    expect(stats.results).toEqual(
      getMonthRange(range).map((i) => {
        let income = 0;
        let expense = 0;
        let balance = 0;
        if (i === 2) {
          income = 30;
          expense = 10;
        } else if (i === 15) {
          income = 40;
          expense = 20;
        }
        if (i >= 2 && i < 15) {
          balance = 20;
        } else if (i >= 15) {
          balance = 40;
        }
        return {
          income,
          expense,
          balance,
          month: getMonthLabel({ monthIndex: i, ...range }),
        };
      }),
    );
  });

  it("show stats between March and June", async () => {
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
    const stats = await getStats(user.id, { range, tags: [] });
    expect(stats.results).toEqual([
      {
        month: getMonthLabel({ monthIndex: 2, ...range }),
        income: 20,
        expense: 10,
        balance: 30,
      },
      {
        month: getMonthLabel({ monthIndex: 3, ...range }),
        income: 20,
        expense: 10,
        balance: 40,
      },
      {
        month: getMonthLabel({ monthIndex: 4, ...range }),
        income: 20,
        expense: 10,
        balance: 50,
      },
      {
        month: getMonthLabel({ monthIndex: 5, ...range }),
        income: 20,
        expense: 10,
        balance: 60,
      },
    ]);
  });

  it("show stats for March", async () => {
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
    const stats = await getStats(user.id, { range, tags: [] });
    expect(stats.results).toEqual([
      {
        month: getMonthLabel({ monthIndex: 2, ...range }),
        income: 20,
        expense: 10,
        balance: 30,
      },
    ]);
  });

  it(`show stats match with "label1"`, async () => {
    const user = await createUser({ email: "user1@example.com" });
    const data: SaveOperationInput[] = [];
    for (let i = 0; i < 3; i++) {
      data.push(
        buildSaveOperationInput({
          type: OperationType.revenue,
          createdAt: dayjs().set("month", i).toDate(),
          amount: 20,
          label: `label${i}`,
        }),
        buildSaveOperationInput({
          type: OperationType.depense,
          createdAt: dayjs().set("month", i).toDate(),
          amount: 10,
          label: `label${i}`,
        }),
      );
    }
    await Promise.all(data.map((el) => createOperation(user.id, el)));

    const range = {
      from: dayjs().set("month", 0).startOf("month").toDate(),
      to: dayjs().set("month", 2).endOf("month").toDate(),
      customActualDate: dayjs().set("month", 2).endOf("month").toDate(),
    };
    const stats = await getStats(user.id, { range, tags: [], label: "label1" });
    expect(stats.results).toEqual([
      {
        month: getMonthLabel({ monthIndex: 0, ...range }),
        income: 0,
        expense: 0,
        balance: 0,
      },
      {
        month: getMonthLabel({ monthIndex: 1, ...range }),
        income: 20,
        expense: 10,
        balance: 10,
      },
      {
        month: getMonthLabel({ monthIndex: 2, ...range }),
        income: 0,
        expense: 0,
        balance: 10,
      },
    ]);
  });

  it(`show stats match with "tag2"`, async () => {
    const user = await createUser({ email: "user1@example.com" });
    const data: SaveOperationInput[] = [];
    for (let i = 0; i < 3; i++) {
      data.push(
        buildSaveOperationInput({
          type: OperationType.revenue,
          createdAt: dayjs().set("month", i).toDate(),
          amount: 20,
          label: `label${i}`,
          tags: [`tag${i}`, `tag${i + 1}`],
        }),
        buildSaveOperationInput({
          type: OperationType.depense,
          createdAt: dayjs().set("month", i).toDate(),
          amount: 10,
          label: `label${i}`,
          tags: [`tag${i}`, `tag${i + 1}`],
        }),
      );
    }
    await Promise.all(data.map((el) => createOperation(user.id, el)));

    const range = {
      from: dayjs().set("month", 0).startOf("month").toDate(),
      to: dayjs().set("month", 2).endOf("month").toDate(),
      customActualDate: dayjs().set("month", 2).endOf("month").toDate(),
    };
    const stats = await getStats(user.id, {
      range,
      tags: ["tag2"],
    });
    expect(stats.results).toEqual([
      {
        month: getMonthLabel({ monthIndex: 0, ...range }),
        income: 0,
        expense: 0,
        balance: 0,
      },
      {
        month: getMonthLabel({ monthIndex: 1, ...range }),
        income: 20,
        expense: 10,
        balance: 10,
      },
      {
        month: getMonthLabel({ monthIndex: 2, ...range }),
        income: 20,
        expense: 10,
        balance: 20,
      },
    ]);
  });

  it(`show stats match with "label1" and "tag1"`, async () => {
    const user = await createUser({ email: "user1@example.com" });
    const data: SaveOperationInput[] = [];
    for (let i = 0; i < 3; i++) {
      data.push(
        buildSaveOperationInput({
          type: OperationType.revenue,
          createdAt: dayjs().set("month", i).toDate(),
          amount: 20,
          label: `label${i}`,
          tags: [`tag${i}`, `tag${i + 1}`],
        }),
        buildSaveOperationInput({
          type: OperationType.depense,
          createdAt: dayjs().set("month", i).toDate(),
          amount: 10,
          label: `label${i}`,
          tags: [`tag${i}`, `tag${i + 1}`],
        }),
      );
    }
    await Promise.all(data.map((el) => createOperation(user.id, el)));

    const range = {
      from: dayjs().set("month", 0).startOf("month").toDate(),
      to: dayjs().set("month", 2).endOf("month").toDate(),
      customActualDate: dayjs().set("month", 2).endOf("month").toDate(),
    };
    const stats = await getStats(user.id, {
      range,
      label: "label1",
      tags: ["tag1"],
    });
    expect(stats.results).toEqual([
      {
        month: getMonthLabel({ monthIndex: 0, ...range }),
        income: 0,
        expense: 0,
        balance: 0,
      },
      {
        month: getMonthLabel({ monthIndex: 1, ...range }),
        income: 20,
        expense: 10,
        balance: 10,
      },
      {
        month: getMonthLabel({ monthIndex: 2, ...range }),
        income: 0,
        expense: 0,
        balance: 10,
      },
    ]);
  });

  it(`show count stats`, async () => {
    const user = await createUser({ email: "user1@example.com" });
    const data: SaveOperationInput[] = [];
    for (let i = 0; i < 3; i++) {
      data.push(
        buildSaveOperationInput({
          type: OperationType.revenue,
          createdAt: dayjs().add(-i, "month").toDate(),
          amount: 20 + i,
          label: `label${i}`,
        }),
        buildSaveOperationInput({
          type: OperationType.depense,
          createdAt: dayjs().add(-i, "month").toDate(),
          amount: 10 + i,
          label: `label${i}`,
        }),
      );
    }
    await Promise.all(data.map((el) => createOperation(user.id, el)));

    const range = {
      from: dayjs().add(-2, "month").startOf("month").toDate(),
      to: dayjs().endOf("month").toDate(),
    };
    const stats = await getStats(user.id, {
      range,
      tags: [],
    });
    expect(stats.countStat).toEqual({
      currentIncome: {
        value: 20,
        fromPreviousMonthInPercent: ((20 - 21) / 21) * 100,
      },
      currentExpense: {
        value: 10,
        fromPreviousMonthInPercent: ((10 - 11) / 11) * 100,
      },
      currentBalance: {
        value: 30,
        fromPreviousMonthInPercent: ((30 - 20) / 20) * 100,
      },
      totalIncome: {
        value: 63,
        fromPreviousMonthInPercent: ((63 - 43) / 43) * 100,
      },
      totalExpense: {
        value: 33,
        fromPreviousMonthInPercent: ((33 - 23) / 23) * 100,
      },
    });
  });
});

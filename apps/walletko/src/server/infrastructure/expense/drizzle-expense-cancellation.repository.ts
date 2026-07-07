import { createId } from "@paralleldrive/cuid2";
import type { ExpenseCancellation } from "src/server/domain/expense/expense-cancellation";
import type { ExpenseCancellationRepository } from "src/server/domain/expense/expense-cancellation.repository";
import type { UnitOfWork } from "src/server/domain/shared/unit-of-work";
import {
  potAllocations,
  transactions,
} from "src/server/infrastructure/db/schema";
import type { DrizzleTx } from "src/server/infrastructure/shared/drizzle-unit-of-work";

export class DrizzleExpenseCancellationRepository implements ExpenseCancellationRepository {
  constructor(private uow: UnitOfWork<DrizzleTx>) {}

  async save(cancellation: ExpenseCancellation): Promise<void> {
    const d = cancellation.data;
    this.uow.register(async (tx) => {
      await tx.insert(transactions).values({
        id: d.id.value,
        type: "expense_cancellation",
        name: d.name.value,
        amount: d.amount.rawCents,
        userId: d.userId.value,
        createdAt: d.createdAt.value,
        cancelsTransactionId: d.cancelsTransactionId.value,
      });

      if (d.lines.length > 0) {
        await tx.insert(potAllocations).values(
          d.lines.map((line) => ({
            id: createId(),
            transactionId: d.id.value,
            potId: line.potId.value,
            amount: line.amount.rawCents,
            createdAt: d.createdAt.value,
          })),
        );
      }
    });
  }
}

import { createId } from "@paralleldrive/cuid2";
import type { IncomeCancellation } from "src/server/domain/income/income-cancellation";
import type { IncomeCancellationRepository } from "src/server/domain/income/income-cancellation.repository";
import type { UnitOfWork } from "src/server/domain/shared/unit-of-work";
import {
  expenseAllocations,
  transactions,
} from "src/server/infrastructure/db/schema";
import type { DrizzleTx } from "src/server/infrastructure/shared/drizzle-unit-of-work";

export class DrizzleIncomeCancellationRepository implements IncomeCancellationRepository {
  constructor(private uow: UnitOfWork<DrizzleTx>) {}

  async save(cancellation: IncomeCancellation): Promise<void> {
    const d = cancellation.data;
    this.uow.register(async (tx) => {
      await tx.insert(transactions).values({
        id: d.id.value,
        type: "income_cancellation",
        name: d.name.value,
        amount: d.amount.rawCents,
        userId: d.userId.value,
        createdAt: d.createdAt.value,
        cancelsTransactionId: d.cancelsTransactionId.value,
      });

      if (d.lines.length > 0) {
        await tx.insert(expenseAllocations).values(
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

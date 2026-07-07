import { createId } from "@paralleldrive/cuid2";
import type { PotTransfer } from "src/server/domain/pot-collection/pot-transfer";
import type { PotTransferRepository } from "src/server/domain/pot-collection/pot-transfer.repository";
import type { UnitOfWork } from "src/server/domain/shared/unit-of-work";
import {
  expenseAllocations,
  potAllocations,
  transactions,
} from "src/server/infrastructure/db/schema";
import type { DrizzleTx } from "src/server/infrastructure/shared/drizzle-unit-of-work";

export class DrizzlePotTransferRepository implements PotTransferRepository {
  constructor(private uow: UnitOfWork<DrizzleTx>) {}

  async save(transfer: PotTransfer): Promise<void> {
    const d = transfer.data;
    this.uow.register(async (tx) => {
      await tx.insert(transactions).values({
        id: d.id.value,
        type: "transfer",
        name: d.name.value,
        amount: d.amount.rawCents,
        userId: d.userId.value,
        createdAt: d.createdAt.value,
      });

      await tx.insert(expenseAllocations).values({
        id: createId(),
        transactionId: d.id.value,
        potId: d.fromPotId.value,
        amount: d.amount.rawCents,
        createdAt: d.createdAt.value,
      });

      if (d.targets.length > 0) {
        await tx.insert(potAllocations).values(
          d.targets.map((t) => ({
            id: createId(),
            transactionId: d.id.value,
            potId: t.potId.value,
            amount: t.amount.rawCents,
            createdAt: d.createdAt.value,
          })),
        );
      }
    });
  }
}

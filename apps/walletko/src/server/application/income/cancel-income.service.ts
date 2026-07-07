import { CancelIncomeBlockedError } from "src/server/domain/income/cancel-income-blocked.error";
import { IncomeCancellation } from "src/server/domain/income/income-cancellation";
import type { IncomeCancellationRepository } from "src/server/domain/income/income-cancellation.repository";
import type { IncomeRepository } from "src/server/domain/income/income.repository";
import type { PotRepository } from "src/server/domain/pot-collection/pot.repository";
import type { UnitOfWork } from "src/server/domain/shared/unit-of-work";
import { Id } from "src/server/domain/shared/value-object/id";

export type CancelIncomeCommand = {
  incomeId: string;
  userId: string;
};

export class CancelIncomeService {
  constructor(
    private ctx: {
      incomeRepo: IncomeRepository;
      potRepo: PotRepository;
      cancellationRepo: IncomeCancellationRepository;
      uow: UnitOfWork;
    },
  ) {}

  async execute(cmd: CancelIncomeCommand): Promise<void> {
    const incomeId = new Id(cmd.incomeId);
    const userId = new Id(cmd.userId);

    const income = await this.ctx.incomeRepo.findOne(incomeId, userId);
    if (!income) throw new Error("Income not found");

    const snapshots = await this.ctx.potRepo.findSnapshot(userId);
    const allPots = await this.ctx.potRepo.findAllWithArchived(userId);

    const blocking = income.data.allocations.flatMap((allocation) => {
      const snapshot = snapshots.find((s) =>
        s.data.pot.data.id.isEqual(allocation.data.potId),
      );
      if (!snapshot) {
        const pot = allPots.find((p) =>
          p.data.id.isEqual(allocation.data.potId),
        );
        return [
          {
            name: pot?.data.name.value ?? "an archived pot",
            shortfall: allocation.data.amount.rawCents,
          },
        ];
      }
      if (snapshot.data.balance.isLessThan(allocation.data.amount)) {
        return [
          {
            name: snapshot.data.pot.data.name.value,
            shortfall:
              allocation.data.amount.rawCents - snapshot.data.balance.rawCents,
          },
        ];
      }
      return [];
    });

    if (blocking.length > 0) throw new CancelIncomeBlockedError(blocking);

    const cancellation = IncomeCancellation.fromIncome(income);
    await this.ctx.incomeRepo.markCanceled(incomeId, userId);
    await this.ctx.cancellationRepo.save(cancellation);
    await this.ctx.uow.commit();
  }
}

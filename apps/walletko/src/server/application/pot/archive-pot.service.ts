import type { PotRepository } from "src/server/domain/pot-collection/pot.repository";
import { PotCollection } from "src/server/domain/pot-collection/pot-collection";
import { PotTransfer } from "src/server/domain/pot-collection/pot-transfer";
import type { PotTransferRepository } from "src/server/domain/pot-collection/pot-transfer.repository";
import type { UnitOfWork } from "src/server/domain/shared/unit-of-work";
import { Datetime } from "src/server/domain/shared/value-object/datetime";
import { Id } from "src/server/domain/shared/value-object/id";
import { Money } from "src/server/domain/shared/value-object/money";
import { Name } from "src/server/domain/shared/value-object/name";
import { Percentage } from "src/server/domain/shared/value-object/percentage";

type ArchivePotCommand = {
  potId: string;
  userId: string;
  toPotId?: string;
  remainingPotsPercentages: { id: string; percentage: number }[];
};

export class ArchivePotService {
  constructor(
    private ctx: {
      potRepo: PotRepository;
      transferRepo: PotTransferRepository;
      uow: UnitOfWork;
    },
  ) {}

  async execute(cmd: ArchivePotCommand) {
    const userId = new Id(cmd.userId);
    const potId = new Id(cmd.potId);

    const snapshots = await this.ctx.potRepo.findSnapshot(userId);
    const snapshot = snapshots.find((s) => s.data.pot.data.id.isEqual(potId));
    if (!snapshot) throw new Error("Pot not found in snapshots");

    const balanceCents = snapshot.data.balance.rawCents;

    if (balanceCents > 0) {
      if (!cmd.toPotId) {
        throw new Error("A destination pot is required to move the balance");
      }
      const toPotId = new Id(cmd.toPotId);
      if (toPotId.isEqual(potId)) {
        throw new Error("Cannot transfer balance to the pot being archived");
      }
      const toSnapshot = snapshots.find((s) =>
        s.data.pot.data.id.isEqual(toPotId),
      );
      if (!toSnapshot) throw new Error("Destination pot not found");

      const amount = Money.fromCents(balanceCents);
      const potName = snapshot.data.pot.data.name.value;
      const transfer = new PotTransfer({
        id: Id.generate(),
        name: new Name(`Transfer from ${potName}`),
        amount,
        userId,
        fromPotId: potId,
        targets: [{ potId: toPotId, amount }],
        createdAt: Datetime.now(),
      });
      await this.ctx.transferRepo.save(transfer);
    }

    const pots = snapshots.map((s) => s.data.pot);
    const potCollection = new PotCollection({ pots });

    potCollection.archivePot(
      potId,
      cmd.remainingPotsPercentages.map((p) => ({
        id: new Id(p.id),
        percentage: new Percentage(p.percentage),
      })),
    );

    for (const pot of potCollection.potsData) {
      await this.ctx.potRepo.save(pot);
    }
    await this.ctx.uow.commit();
  }
}

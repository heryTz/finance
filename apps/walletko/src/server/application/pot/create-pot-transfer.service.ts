import type { PotRepository } from "src/server/domain/pot-collection/pot.repository";
import { PotTransfer } from "src/server/domain/pot-collection/pot-transfer";
import type { PotTransferRepository } from "src/server/domain/pot-collection/pot-transfer.repository";
import type { UnitOfWork } from "src/server/domain/shared/unit-of-work";
import { Datetime } from "src/server/domain/shared/value-object/datetime";
import { Id } from "src/server/domain/shared/value-object/id";
import { Money } from "src/server/domain/shared/value-object/money";
import { Name } from "src/server/domain/shared/value-object/name";

type CreatePotTransferCommand = {
  fromPotId: string;
  toPotId: string;
  amount: number;
  userId: string;
};

export class CreatePotTransferService {
  constructor(
    private ctx: {
      potRepo: PotRepository;
      transferRepo: PotTransferRepository;
      uow: UnitOfWork;
    },
  ) {}

  async execute(cmd: CreatePotTransferCommand) {
    if (cmd.fromPotId === cmd.toPotId) {
      throw new Error("Cannot transfer to the same pot");
    }

    const amount = new Money(cmd.amount);
    if (amount.rawCents === 0) {
      throw new Error("Transfer amount must be greater than zero");
    }

    const userId = new Id(cmd.userId);
    const snapshots = await this.ctx.potRepo.findSnapshot(userId);

    const fromId = new Id(cmd.fromPotId);
    const toId = new Id(cmd.toPotId);

    const fromSnapshot = snapshots.find((s) =>
      s.data.pot.data.id.isEqual(fromId),
    );
    if (!fromSnapshot) throw new Error("Source pot not found");

    const toSnapshot = snapshots.find((s) => s.data.pot.data.id.isEqual(toId));
    if (!toSnapshot) throw new Error("Destination pot not found");

    if (!amount.isLessOrEqualThan(fromSnapshot.data.balance)) {
      throw new Error("Insufficient balance");
    }

    const fromName = fromSnapshot.data.pot.data.name.value;
    const toName = toSnapshot.data.pot.data.name.value;

    const transfer = new PotTransfer({
      id: Id.generate(),
      name: new Name(`${fromName} → ${toName}`),
      amount,
      userId,
      fromPotId: fromId,
      targets: [{ potId: toId, amount }],
      createdAt: Datetime.now(),
    });

    await this.ctx.transferRepo.save(transfer);
    await this.ctx.uow.commit();
  }
}

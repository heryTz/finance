import type { PotTransfer } from "src/server/domain/pot-collection/pot-transfer";
import type { PotTransferRepository } from "src/server/domain/pot-collection/pot-transfer.repository";

export class InMemoryPotTransferRepository implements PotTransferRepository {
  private store: PotTransfer[] = [];

  async save(transfer: PotTransfer): Promise<void> {
    this.store.push(transfer);
  }

  all() {
    return this.store;
  }
}

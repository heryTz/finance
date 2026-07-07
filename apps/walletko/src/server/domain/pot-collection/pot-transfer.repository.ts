import type { PotTransfer } from "./pot-transfer";

export interface PotTransferRepository {
  save(transfer: PotTransfer): Promise<void>;
}

import type { IncomeCancellation } from "./income-cancellation";

export interface IncomeCancellationRepository {
  save(cancellation: IncomeCancellation): Promise<void>;
}

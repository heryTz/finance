import type { IncomeCancellation } from "src/server/domain/income/income-cancellation";
import type { IncomeCancellationRepository } from "src/server/domain/income/income-cancellation.repository";

export class InMemoryIncomeCancellationRepository implements IncomeCancellationRepository {
  private store: IncomeCancellation[] = [];

  async save(cancellation: IncomeCancellation): Promise<void> {
    this.store.push(cancellation);
  }

  all() {
    return this.store;
  }
}

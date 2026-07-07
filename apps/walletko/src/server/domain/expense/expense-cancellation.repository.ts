import type { ExpenseCancellation } from "./expense-cancellation";

export interface ExpenseCancellationRepository {
  save(cancellation: ExpenseCancellation): Promise<void>;
}

type Operation<Tx> = (tx: Tx) => Promise<void>;

export interface UnitOfWork<Tx = unknown> {
  register(op: Operation<Tx>): void;
  commit(): Promise<void>;
}

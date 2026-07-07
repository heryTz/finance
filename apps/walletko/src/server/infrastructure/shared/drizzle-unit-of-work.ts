import type { UnitOfWork } from "src/server/domain/shared/unit-of-work";
import { db } from "src/server/infrastructure/db/client";

export type DrizzleTx = Parameters<Parameters<typeof db.transaction>[0]>[0];

export class DrizzleUnitOfWork implements UnitOfWork<DrizzleTx> {
  private ops: ((tx: DrizzleTx) => Promise<void>)[] = [];

  register(op: (tx: DrizzleTx) => Promise<void>): void {
    this.ops.push(op);
  }

  async commit(): Promise<void> {
    const ops = this.ops;
    this.ops = [];
    if (ops.length === 0) return;
    await db.transaction(async (tx) => {
      for (const op of ops) {
        await op(tx);
      }
    });
  }
}

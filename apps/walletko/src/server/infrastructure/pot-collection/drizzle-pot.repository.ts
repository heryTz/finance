import { db } from "src/server/infrastructure/db/client";
import { Pot } from "src/server/domain/pot-collection/pot";
import type { PotRepository } from "src/server/domain/pot-collection/pot.repository";
import { PotSnapshot } from "src/server/domain/pot-collection/value-object/pot-snapshot";
import type { UnitOfWork } from "src/server/domain/shared/unit-of-work";
import { Datetime } from "src/server/domain/shared/value-object/datetime";
import { Id } from "src/server/domain/shared/value-object/id";
import { Money } from "src/server/domain/shared/value-object/money";
import { Name } from "src/server/domain/shared/value-object/name";
import { Percentage } from "src/server/domain/shared/value-object/percentage";
import { pots } from "src/server/infrastructure/db/schema";
import type { DrizzleTx } from "src/server/infrastructure/shared/drizzle-unit-of-work";
import { eq, sql } from "drizzle-orm";

export class DrizzlePotRepository implements PotRepository {
  constructor(private uow: UnitOfWork<DrizzleTx>) {}

  async save(pot: Pot): Promise<void> {
    const d = pot.data;
    this.uow.register(async (tx) => {
      await tx
        .insert(pots)
        .values({
          id: d.id.value,
          name: d.name.value,
          percentage: d.percentage.value,
          userId: d.userId.value,
          createdAt: d.createdAt.value,
        })
        .onConflictDoUpdate({
          target: pots.id,
          set: {
            name: d.name.value,
            percentage: d.percentage.value,
          },
        });
    });
  }

  async findAll(userId: Id): Promise<Pot[]> {
    const rows = await db
      .select()
      .from(pots)
      .where(eq(pots.userId, userId.value));
    return rows.map(
      (row) =>
        new Pot({
          id: new Id(row.id),
          name: new Name(row.name),
          percentage: new Percentage(row.percentage),
          userId: new Id(row.userId),
          createdAt: new Datetime(row.createdAt),
          updatedAt: row.updatedAt ? new Datetime(row.updatedAt) : null,
        }),
    );
  }

  async findSnapshot(userId: Id): Promise<PotSnapshot[]> {
    const rows = await db.execute<{
      id: string;
      name: string;
      percentage: number;
      user_id: string;
      created_at: Date;
      updated_at: Date | null;
      balance: string;
    }>(sql`
      SELECT p.*,
        COALESCE(inc.total, 0) - COALESCE(exp.total, 0) AS balance
      FROM pots p
      LEFT JOIN (
        SELECT pot_id, SUM(amount) AS total FROM pot_allocations GROUP BY pot_id
      ) inc ON inc.pot_id = p.id
      LEFT JOIN (
        SELECT pot_id, SUM(amount) AS total FROM expense_allocations GROUP BY pot_id
      ) exp ON exp.pot_id = p.id
      WHERE p.user_id = ${userId.value}
    `);

    return rows.rows.map((row) => {
      const pot = new Pot({
        id: new Id(row.id),
        name: new Name(row.name),
        percentage: new Percentage(row.percentage),
        userId: new Id(row.user_id),
        createdAt: new Datetime(row.created_at),
        updatedAt: row.updated_at ? new Datetime(row.updated_at) : null,
      });
      return new PotSnapshot({
        pot,
        balance: Money.fromCents(Number(row.balance)),
      });
    });
  }
}

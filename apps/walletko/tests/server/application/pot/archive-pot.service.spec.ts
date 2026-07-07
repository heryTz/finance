import { ArchivePotService } from "src/server/application/pot/archive-pot.service";
import { InMemoryPotRepository } from "src/server/infrastructure/pot-collection/in-memory-pot.repository";
import { InMemoryPotTransferRepository } from "src/server/infrastructure/pot-collection/in-memory-pot-transfer.repository";
import { InMemoryIncomeRepository } from "src/server/infrastructure/income/in-memory-income.repository";
import { InMemoryExpenseRepository } from "src/server/infrastructure/expense/in-memory-expense.repository";
import { InMemoryUnitOfWork } from "src/server/infrastructure/shared/in-memory-unit-of-work";
import {
  makePot,
  makePotSnapshot,
} from "src/server/domain/pot-collection/pot.factory";
import { Percentage } from "src/server/domain/shared/value-object/percentage";
import { Id } from "src/server/domain/shared/value-object/id";
import { Money } from "src/server/domain/shared/value-object/money";

describe("ArchivePotService", () => {
  const userId = Id.generate().value;
  let potRepo: InMemoryPotRepository;
  let transferRepo: InMemoryPotTransferRepository;
  let uow: InMemoryUnitOfWork;
  let service: ArchivePotService;

  beforeEach(() => {
    potRepo = new InMemoryPotRepository({
      incomeRepository: new InMemoryIncomeRepository(),
      expenseRepository: new InMemoryExpenseRepository(),
    });
    transferRepo = new InMemoryPotTransferRepository();
    uow = new InMemoryUnitOfWork();
    service = new ArchivePotService({ potRepo, transferRepo, uow });
  });

  it("throws when pot is not found", async () => {
    const defaultPot = makePot({
      percentage: new Percentage(100),
      isDefault: true,
    });
    potRepo.all().push(defaultPot);

    await expect(
      service.execute({
        potId: Id.generate().value,
        userId,
        remainingPotsPercentages: [
          { id: defaultPot.data.id.value, percentage: 100 },
        ],
      }),
    ).rejects.toThrow("Pot not found in snapshots");
  });

  it("archives pot and adjusts percentages when balance is zero (no transfer)", async () => {
    const defaultPot = makePot({
      percentage: new Percentage(40),
      isDefault: true,
    });
    const pot2 = makePot({ percentage: new Percentage(30) });
    const pot3 = makePot({ percentage: new Percentage(30) });
    potRepo.all().push(defaultPot, pot2, pot3);

    vi.spyOn(potRepo, "findSnapshot").mockResolvedValue([
      makePotSnapshot({ pot: defaultPot, balance: Money.fromCents(0) }),
      makePotSnapshot({ pot: pot2, balance: Money.fromCents(0) }),
      makePotSnapshot({ pot: pot3, balance: Money.fromCents(0) }),
    ]);

    await service.execute({
      potId: pot2.data.id.value,
      userId,
      remainingPotsPercentages: [
        { id: defaultPot.data.id.value, percentage: 50 },
        { id: pot3.data.id.value, percentage: 50 },
      ],
    });

    const deletedPot = potRepo
      .all()
      .find((p) => p.data.id.isEqual(pot2.data.id));
    expect(deletedPot?.data.archivedAt).not.toBeNull();
    expect(defaultPot.data.percentage.value).toBe(50);
    expect(transferRepo.all()).toHaveLength(0);
  });

  it("moves the full balance to the destination pot, then archives", async () => {
    const defaultPot = makePot({
      percentage: new Percentage(40),
      isDefault: true,
    });
    const pot2 = makePot({ percentage: new Percentage(30) });
    const pot3 = makePot({ percentage: new Percentage(30) });
    potRepo.all().push(defaultPot, pot2, pot3);

    vi.spyOn(potRepo, "findSnapshot").mockResolvedValue([
      makePotSnapshot({ pot: defaultPot, balance: Money.fromCents(0) }),
      makePotSnapshot({ pot: pot2, balance: Money.fromCents(5000) }),
      makePotSnapshot({ pot: pot3, balance: Money.fromCents(0) }),
    ]);

    await service.execute({
      potId: pot2.data.id.value,
      userId,
      toPotId: defaultPot.data.id.value,
      remainingPotsPercentages: [
        { id: defaultPot.data.id.value, percentage: 50 },
        { id: pot3.data.id.value, percentage: 50 },
      ],
    });

    const transfer = transferRepo.all()[0];
    expect(transferRepo.all()).toHaveLength(1);
    expect(transfer.data.fromPotId.isEqual(pot2.data.id)).toBe(true);
    expect(transfer.data.targets).toHaveLength(1);
    expect(transfer.data.targets[0].potId.isEqual(defaultPot.data.id)).toBe(
      true,
    );
    expect(transfer.data.targets[0].amount.rawCents).toBe(5000);

    const deletedPot = potRepo
      .all()
      .find((p) => p.data.id.isEqual(pot2.data.id));
    expect(deletedPot?.data.archivedAt).not.toBeNull();
  });

  it("throws when the pot has a balance but no destination is given", async () => {
    const defaultPot = makePot({
      percentage: new Percentage(60),
      isDefault: true,
    });
    const pot2 = makePot({ percentage: new Percentage(40) });
    potRepo.all().push(defaultPot, pot2);

    vi.spyOn(potRepo, "findSnapshot").mockResolvedValue([
      makePotSnapshot({ pot: defaultPot, balance: Money.fromCents(0) }),
      makePotSnapshot({ pot: pot2, balance: Money.fromCents(5000) }),
    ]);

    await expect(
      service.execute({
        potId: pot2.data.id.value,
        userId,
        remainingPotsPercentages: [
          { id: defaultPot.data.id.value, percentage: 100 },
        ],
      }),
    ).rejects.toThrow("A destination pot is required to move the balance");
  });

  it("throws when the destination is the pot being archived", async () => {
    const defaultPot = makePot({
      percentage: new Percentage(60),
      isDefault: true,
    });
    const pot2 = makePot({ percentage: new Percentage(40) });
    potRepo.all().push(defaultPot, pot2);

    vi.spyOn(potRepo, "findSnapshot").mockResolvedValue([
      makePotSnapshot({ pot: defaultPot, balance: Money.fromCents(0) }),
      makePotSnapshot({ pot: pot2, balance: Money.fromCents(5000) }),
    ]);

    await expect(
      service.execute({
        potId: pot2.data.id.value,
        userId,
        toPotId: pot2.data.id.value,
        remainingPotsPercentages: [
          { id: defaultPot.data.id.value, percentage: 100 },
        ],
      }),
    ).rejects.toThrow("Cannot transfer balance to the pot being archived");
  });

  it("archives the last non-default pot, leaving only the default pot", async () => {
    const defaultPot = makePot({
      percentage: new Percentage(50),
      isDefault: true,
    });
    const pot2 = makePot({ percentage: new Percentage(50) });
    potRepo.all().push(defaultPot, pot2);

    vi.spyOn(potRepo, "findSnapshot").mockResolvedValue([
      makePotSnapshot({ pot: defaultPot, balance: Money.fromCents(0) }),
      makePotSnapshot({ pot: pot2, balance: Money.fromCents(0) }),
    ]);

    await service.execute({
      potId: pot2.data.id.value,
      userId,
      remainingPotsPercentages: [
        { id: defaultPot.data.id.value, percentage: 100 },
      ],
    });

    const deletedPot = potRepo
      .all()
      .find((p) => p.data.id.isEqual(pot2.data.id));
    expect(deletedPot?.data.archivedAt).not.toBeNull();
    expect(defaultPot.data.percentage.value).toBe(100);
    expect(transferRepo.all()).toHaveLength(0);
  });
});

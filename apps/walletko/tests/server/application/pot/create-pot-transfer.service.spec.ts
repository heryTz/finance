import { CreatePotTransferService } from "src/server/application/pot/create-pot-transfer.service";
import { InMemoryPotRepository } from "src/server/infrastructure/pot-collection/in-memory-pot.repository";
import { InMemoryPotTransferRepository } from "src/server/infrastructure/pot-collection/in-memory-pot-transfer.repository";
import { InMemoryIncomeRepository } from "src/server/infrastructure/income/in-memory-income.repository";
import { InMemoryExpenseRepository } from "src/server/infrastructure/expense/in-memory-expense.repository";
import { InMemoryUnitOfWork } from "src/server/infrastructure/shared/in-memory-unit-of-work";
import {
  makePot,
  makePotSnapshot,
} from "src/server/domain/pot-collection/pot.factory";
import { Id } from "src/server/domain/shared/value-object/id";
import { Money } from "src/server/domain/shared/value-object/money";

describe("CreatePotTransferService", () => {
  const userId = Id.generate().value;
  let potRepo: InMemoryPotRepository;
  let transferRepo: InMemoryPotTransferRepository;
  let uow: InMemoryUnitOfWork;
  let service: CreatePotTransferService;

  beforeEach(() => {
    potRepo = new InMemoryPotRepository({
      incomeRepository: new InMemoryIncomeRepository(),
      expenseRepository: new InMemoryExpenseRepository(),
    });
    transferRepo = new InMemoryPotTransferRepository();
    uow = new InMemoryUnitOfWork();
    service = new CreatePotTransferService({ potRepo, transferRepo, uow });
  });

  it("throws when fromPotId equals toPotId", async () => {
    const potId = Id.generate().value;
    await expect(
      service.execute({ fromPotId: potId, toPotId: potId, amount: 50, userId }),
    ).rejects.toThrow("Cannot transfer to the same pot");
  });

  it("throws when amount is zero", async () => {
    const from = makePot({});
    const to = makePot({});
    await expect(
      service.execute({
        fromPotId: from.data.id.value,
        toPotId: to.data.id.value,
        amount: 0,
        userId,
      }),
    ).rejects.toThrow("Transfer amount must be greater than zero");
  });

  it("throws when source pot is not found in snapshot", async () => {
    const pot = makePot({});
    vi.spyOn(potRepo, "findSnapshot").mockResolvedValue([
      makePotSnapshot({ pot, balance: Money.fromCents(10000) }),
    ]);
    await expect(
      service.execute({
        fromPotId: Id.generate().value,
        toPotId: pot.data.id.value,
        amount: 50,
        userId,
      }),
    ).rejects.toThrow("Source pot not found");
  });

  it("throws when destination pot is not found in snapshot", async () => {
    const pot = makePot({});
    vi.spyOn(potRepo, "findSnapshot").mockResolvedValue([
      makePotSnapshot({ pot, balance: Money.fromCents(10000) }),
    ]);
    await expect(
      service.execute({
        fromPotId: pot.data.id.value,
        toPotId: Id.generate().value,
        amount: 50,
        userId,
      }),
    ).rejects.toThrow("Destination pot not found");
  });

  it("throws when amount exceeds source pot balance", async () => {
    const from = makePot({});
    const to = makePot({});
    vi.spyOn(potRepo, "findSnapshot").mockResolvedValue([
      makePotSnapshot({ pot: from, balance: Money.fromCents(5000) }),
      makePotSnapshot({ pot: to, balance: Money.fromCents(0) }),
    ]);
    await expect(
      service.execute({
        fromPotId: from.data.id.value,
        toPotId: to.data.id.value,
        amount: 100,
        userId,
      }),
    ).rejects.toThrow("Insufficient balance");
  });

  it("creates a transfer with auto-generated name and correct targets", async () => {
    const from = makePot({});
    const to = makePot({});
    vi.spyOn(potRepo, "findSnapshot").mockResolvedValue([
      makePotSnapshot({ pot: from, balance: Money.fromCents(84000) }),
      makePotSnapshot({ pot: to, balance: Money.fromCents(32000) }),
    ]);

    await service.execute({
      fromPotId: from.data.id.value,
      toPotId: to.data.id.value,
      amount: 200,
      userId,
    });

    expect(transferRepo.all()).toHaveLength(1);
    const transfer = transferRepo.all()[0];
    expect(transfer.data.name.value).toBe(
      `${from.data.name.value} → ${to.data.name.value}`,
    );
    expect(transfer.data.fromPotId.isEqual(from.data.id)).toBe(true);
    expect(transfer.data.targets).toHaveLength(1);
    expect(transfer.data.targets[0].potId.isEqual(to.data.id)).toBe(true);
    expect(transfer.data.targets[0].amount.rawCents).toBe(20000);
  });

  it("allows transferring the exact balance amount", async () => {
    const from = makePot({});
    const to = makePot({});
    vi.spyOn(potRepo, "findSnapshot").mockResolvedValue([
      makePotSnapshot({ pot: from, balance: Money.fromCents(5000) }),
      makePotSnapshot({ pot: to, balance: Money.fromCents(0) }),
    ]);

    await service.execute({
      fromPotId: from.data.id.value,
      toPotId: to.data.id.value,
      amount: 50,
      userId,
    });

    expect(transferRepo.all()).toHaveLength(1);
    expect(transferRepo.all()[0].data.amount.rawCents).toBe(5000);
  });
});

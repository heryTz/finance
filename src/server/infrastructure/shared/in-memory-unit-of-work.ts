import { UnitOfWork } from "@/server/domain/shared/unit-of-work";

export class InMemoryUnitOfWork implements UnitOfWork {
  register(): void {}
  async commit(): Promise<void> {}
}

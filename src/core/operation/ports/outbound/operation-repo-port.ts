import { Operation } from "../../entities/operation";

export interface OperationRepoPort {
  create(
    data: Omit<Operation, "id" | "createdAt" | "updatedAt">,
  ): Promise<Operation>;
}

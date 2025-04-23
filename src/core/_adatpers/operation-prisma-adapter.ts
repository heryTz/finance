import { Operation } from "../operation/entities/operation";
import { OperationRepoPort } from "../operation/ports/outbound/operation-repo-port";

export class OperationPrismaAdapter implements OperationRepoPort {
  async create(
    data: Omit<Operation, "id" | "createdAt" | "updatedAt">,
  ): Promise<Operation> {
    throw new Error("Method not implemented.");
  }
}

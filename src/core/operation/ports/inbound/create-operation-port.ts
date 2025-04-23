import { Operation } from "../../entities/operation";

export type CreateOperationInput = Omit<
  Operation,
  "id" | "createdAt" | "updatedAt"
>;

export interface CreateOperationPort {
  execute(userId: string, input: CreateOperationInput): Promise<Operation>;
}

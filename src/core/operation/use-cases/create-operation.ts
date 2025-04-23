import { Operation } from "../entities/operation";
import {
  CreateOperationInput,
  CreateOperationPort,
} from "../ports/inbound/create-operation-port";

export default class CreateOperation implements CreateOperationPort {
  async execute(
    userId: string,
    input: CreateOperationInput,
  ): Promise<Operation> {
    throw new Error("Method not implemented.");
  }
}

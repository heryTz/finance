import { createUser } from "../../user/user-service";
import {
  createOperation,
  deleteOperation,
  getOperationById,
  getOperations,
  updateOperation,
} from "../operation-service";
import { OperationType } from "@/entity/operation";
import { buildSaveOperationInput } from "@/lib/factory";
import { NotFoundException } from "@/lib/exception";

describe("operation service", () => {
  it("create operation", async () => {
    const user1 = await createUser({ email: "user1@example.com" });
    const input = buildSaveOperationInput({ tags: ["tag1"] });
    const operation = await createOperation(user1.id, input);
    expect(operation.label).toBe(input.label);
    expect(operation.amount.toNumber()).toBe(input.amount);
    expect(operation.type).toBe(input.type);
    expect(operation.createdAt.toISOString()).toBe(
      input.createdAt.toISOString(),
    );
    expect(operation.tags[0].name).toBe(input.tags[0]);
  });

  it("can only view my operation list", async () => {
    const user1 = await createUser({ email: "user1@example.com" });
    const user2 = await createUser({ email: "user2@example.com" });
    await createOperation(user1.id, buildSaveOperationInput());
    const user2Operations = await getOperations(user2.id, {});
    const operationOfOtherUser = user2Operations.results.find(
      (el) => el.userId !== user2.id,
    );
    expect(operationOfOtherUser).toBeFalsy();
    expect(user2Operations.stats.expense).toBe(0);
    expect(user2Operations.stats.income).toBe(0);
  });

  it("can only view my operation item", async () => {
    const user1 = await createUser({ email: "user1@example.com" });
    const user2 = await createUser({ email: "user2@example.com" });
    const user1Operation = await createOperation(
      user1.id,
      buildSaveOperationInput(),
    );
    const user1OperationById = await getOperationById(
      user1.id,
      user1Operation.id,
    );
    expect(user1OperationById).toBeTruthy();
    await expect(getOperationById(user2.id, user1Operation.id)).rejects.toThrow(
      NotFoundException,
    );
  });

  it("update operation", async () => {
    const user = await createUser({ email: "user1@example.com" });
    const operation = await createOperation(
      user.id,
      buildSaveOperationInput({ tags: ["tag2"] }),
    );
    const update = buildSaveOperationInput({
      tags: ["tag1"],
      type: OperationType.depense,
    });
    const operationUpdated = await updateOperation(
      user.id,
      operation.id,
      update,
    );
    expect(operationUpdated.label).toBe(update.label);
    expect(operationUpdated.amount.toNumber()).toBe(update.amount);
    expect(operation.type).toBe(operation.type);
    expect(operationUpdated.tags[0].name).toBe(update.tags[0]);
  });

  it("when update operation, attach all tag on input, remove all tag not present on input", async () => {
    const user = await createUser({ email: "user1@example.com" });
    const operation = await createOperation(
      user.id,
      buildSaveOperationInput({ tags: ["tag1", "tag3"] }),
    );
    const update = buildSaveOperationInput({
      tags: ["tag1", "tag2"],
    });
    const operationUpdated = await updateOperation(
      user.id,
      operation.id,
      update,
    );
    expect(operationUpdated.tags.length).toEqual(2);
    expect(
      operationUpdated.tags.find((el) => el.name === "tag1"),
    ).toBeDefined();
    expect(
      operationUpdated.tags.find((el) => el.name === "tag2"),
    ).toBeDefined();
  });

  it("can only update my operation", async () => {
    const user1 = await createUser({ email: "user1@example.com" });
    const user2 = await createUser({ email: "user2@example.com" });
    const user1Operation = await createOperation(
      user1.id,
      buildSaveOperationInput(),
    );
    await expect(
      updateOperation(user2.id, user1Operation.id, buildSaveOperationInput()),
    ).rejects.toThrow(NotFoundException);
  });

  it("delete operation", async () => {
    const user = await createUser({ email: "user1@example.com" });
    const operation = await createOperation(user.id, buildSaveOperationInput());
    const operationDeleted = await deleteOperation(user.id, operation.id);
    expect(operationDeleted.id).toBe(operation.id);
  });

  it("can only delete my operation", async () => {
    const user1 = await createUser({ email: "user1@example.com" });
    const user2 = await createUser({ email: "user2@example.com" });
    const user1Operation = await createOperation(
      user1.id,
      buildSaveOperationInput(),
    );
    await expect(
      deleteOperation(user2.id, user1Operation.id),
    ).rejects.toThrow();
  });
});

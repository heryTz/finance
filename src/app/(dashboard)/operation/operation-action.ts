"use server";

import { apiGuard } from "@/lib/api-guard";
import { SaveOperationInput, saveOperationInputSchema } from "./operation-dto";
import {
  createOperation,
  deleteOperation,
  updateOperation,
} from "./operation-service";
import { revalidatePath } from "next/cache";
import { routes } from "@/app/routes";

export async function createOperationAction(input: SaveOperationInput) {
  const { user } = await apiGuard();
  const data = saveOperationInputSchema.parse(input);
  const operation = await createOperation(user.id, data);
  revalidatePath(routes.operation());
  return operation;
}

export async function updateOperationAction(
  id: string,
  input: SaveOperationInput,
) {
  const { user } = await apiGuard();
  const data = saveOperationInputSchema.parse(input);
  const operation = await updateOperation(user.id, id, data);
  revalidatePath(routes.operation());
  return operation;
}

export async function deleteOperationAction(id: string) {
  const { user } = await apiGuard();
  const operation = await deleteOperation(user.id, id);
  revalidatePath(routes.operation());
  return operation;
}

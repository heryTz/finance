"use server";

import { apiGuard } from "@/lib/api-guard";
import { SaveProviderInput, saveProviderInputSchema } from "./provider-dto";
import {
  createProvider,
  deleteProvider,
  updateProvider,
} from "./provider-service";
import { revalidatePath } from "next/cache";
import { routes } from "@/app/routes";

export async function createProviderAction(input: SaveProviderInput) {
  const { user } = await apiGuard();
  const data = saveProviderInputSchema.parse(input);
  const provider = await createProvider(user.id, data);
  revalidatePath(routes.invoice());
  return provider;
}

export async function updateProviderAction(
  id: string,
  input: SaveProviderInput,
) {
  const { user } = await apiGuard();
  const data = saveProviderInputSchema.parse(input);
  const provider = await updateProvider(user.id, id, data);
  revalidatePath(routes.invoice());
  return provider;
}

export async function deleteProviderAction(id: string) {
  const { user } = await apiGuard();
  const provider = await deleteProvider(user.id, id);
  revalidatePath(routes.invoice());
  return provider;
}

"use server";

import { apiGuard } from "@/lib/api-guard";
import { SaveClientInput, saveClientInputSchema } from "./client-dto";
import { createClient, deleteClient, updateClient } from "./client-service";
import { revalidatePath } from "next/cache";
import { routes } from "@/app/routes";

export async function createClientAction(input: SaveClientInput) {
  const { user } = await apiGuard();
  const data = saveClientInputSchema.parse(input);
  const client = await createClient(user.id, data);
  revalidatePath(routes.invoice());
  return client;
}

export async function updateClientAction(id: string, input: SaveClientInput) {
  const { user } = await apiGuard();
  const data = saveClientInputSchema.parse(input);
  const client = await updateClient(user.id, id, data);
  revalidatePath(routes.invoice());
  return client;
}

export async function deleteClientAction(id: string) {
  const { user } = await apiGuard();
  const client = await deleteClient(user.id, id);
  revalidatePath(routes.invoice());
  return client;
}

import { saveProviderInputSchema } from "@/app/(dashboard)/invoice/provider/provider-dto";
import {
  createProvider,
  getProviders,
} from "@/app/(dashboard)/invoice/provider/provider-service";
import { apiGuard } from "@/lib/api-guard";
import { weh } from "@/lib/with-error-handler";
import { NextResponse } from "next/server";

export const POST = weh(async (request: Request) => {
  const { user } = await apiGuard();
  const input = saveProviderInputSchema.parse(await request.json());
  const provider = await createProvider(user.id, input);
  return NextResponse.json(provider);
});

export const GET = weh(async () => {
  const { user } = await apiGuard();
  const providers = await getProviders(user.id);
  return NextResponse.json(providers);
});

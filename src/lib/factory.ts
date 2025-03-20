import { SaveOperationInput } from "@/app/(dashboard)/operation/operation-dto";
import { CreateInvoiceInput } from "@/app/(dashboard)/invoice/index/invoice-dto";
import { SaveClientInput } from "@/app/(dashboard)/invoice/client/client-dto";
import { createClient } from "@/app/(dashboard)/invoice/client/client-service";
import { createPaymentMode } from "@/app/(dashboard)/invoice/payment-mode/payment-mode-service";
import { OperationType } from "@/entity/operation";
import { faker } from "@faker-js/faker";
import { z } from "zod";
import { getStatsQuerySchema } from "@/app/(dashboard)/(stat)/stat-dto";
import { createProvider } from "@/app/(dashboard)/invoice/provider/provider-service";
import { SaveProviderInput } from "@/app/(dashboard)/invoice/provider/provider-dto";
import dayjs from "dayjs";

export function buildSaveOperationInput(
  operation?: Partial<SaveOperationInput>,
): SaveOperationInput {
  return {
    label: faker.commerce.product(),
    amount: +faker.commerce.price(),
    createdAt: new Date(),
    tags: [],
    type: OperationType.revenue,
    ...operation,
  };
}

export function buildSaveClientInput(
  client?: Partial<SaveClientInput>,
): SaveClientInput {
  return {
    address: "address",
    email: "client@client.com",
    name: "name",
    ...client,
  };
}

export function buildSaveProviderInput(
  provider?: Partial<SaveProviderInput>,
): SaveProviderInput {
  return {
    address: "address",
    email: "client@client.com",
    name: "name",
    ...provider,
  };
}

export async function buildCreateInvoiceInput(
  userId: string,
  invoice?: Partial<CreateInvoiceInput>,
): Promise<CreateInvoiceInput> {
  const payment = await createPaymentMode(userId, {
    name: `${faker.company.buzzNoun()}${new Date().getTime()}`,
  });
  const client = await createClient(userId, {
    address: faker.commerce.department(),
    email: faker.string.alpha() + "@test.com",
    name: faker.person.fullName(),
  });
  const provider = await createProvider(userId, {
    address: faker.commerce.department(),
    email: faker.string.alpha() + "@test.com",
    name: faker.person.fullName(),
  });
  return {
    clientId: client.id,
    currency: "Ar",
    paymentModeId: payment.id,
    tva: 0,
    products: [{ name: "p1", price: 100, qte: 1 }],
    createdAt: new Date(),
    providerId: provider.id,
    ...invoice,
  };
}

export function buildGetStatQuery(
  query: Partial<z.infer<typeof getStatsQuerySchema>>,
): z.infer<typeof getStatsQuerySchema> {
  return {
    tags: [],
    display: [],
    range: {
      from: dayjs().format("YYYY-MM-DD"),
      to: dayjs().format("YYYY-MM-DD"),
    },
    ...query,
  };
}

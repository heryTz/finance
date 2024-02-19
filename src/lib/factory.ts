import { SaveFinanceInput } from "@/app/(dashboard)/finance/finance-dto";
import { CreateInvoiceInput } from "@/app/(dashboard)/invoice/(index)/invoice-dto";
import { SaveClientInput } from "@/app/(dashboard)/invoice/client/client-dto";
import { createClient } from "@/app/(dashboard)/invoice/client/client-service";
import { createPaymentMode } from "@/app/(dashboard)/invoice/payment-mode/payment-mode-service";
import { FinanceType } from "@/entity";
import { faker } from "@faker-js/faker";

export function buildSaveFinanceInput(
  finance?: Partial<SaveFinanceInput>,
): SaveFinanceInput {
  return {
    label: faker.commerce.product(),
    amount: +faker.commerce.price(),
    createdAt: new Date().toISOString(),
    tags: [],
    type: FinanceType.revenue,
    ...finance,
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
  return {
    clientId: client.id,
    currency: "Ar",
    paymentModeId: payment.id,
    tva: 0,
    products: [{ name: "p1", price: 100, qte: 1 }],
    ...invoice,
  };
}

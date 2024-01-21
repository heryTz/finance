import { SaveFinanceInput } from "@/app/(dashboard)/finance/finance-dto";
import { SaveClientInput } from "@/app/(dashboard)/invoice/client/client-dto";
import { FinanceType } from "@/entity";
import { faker } from "@faker-js/faker";

export function buildSaveFinanceInput(
  finance?: Partial<SaveFinanceInput>
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
  client?: Partial<SaveClientInput>
): SaveClientInput {
  return {
    address: "address",
    email: "client@client.com",
    name: "name",
    ...client,
  };
}

import { SaveFinanceInput } from "@/app/(dashboard)/finance/finance-dto";
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

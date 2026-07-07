export type TransactionDTO = {
  id: string;
  type:
    | "income"
    | "expense"
    | "transfer"
    | "canceled_income"
    | "income_cancellation"
    | "canceled_expense"
    | "expense_cancellation";
  name: string;
  amount: number;
  createdAt: Date;
  tags: { id: string; name: string }[];
};

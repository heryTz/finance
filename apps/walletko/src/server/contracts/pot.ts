export type PotWithBalanceDTO = {
  id: string;
  name: string;
  percentage: number;
  color: string;
  isDefault: boolean;
  createdAt: Date;
  balance: number; // in cents
};

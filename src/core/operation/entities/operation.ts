export enum OperationType {
  revenue = "revenue",
  depense = "depense",
}

export type Operation = {
  id: string;
  label: string;
  amount: number;
  type: OperationType;
  userId: string;
  createdAt: Date;
  updatedAt: Date | null;
};

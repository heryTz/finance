import { FinanceSaveModal } from ".";
import { useFinanceSaveStore } from "../finance-store";

export function FinanceSave() {
  const { open } = useFinanceSaveStore();
  if (!open) return null;
  return <FinanceSaveModal />;
}

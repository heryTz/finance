import { PaymentsModeSaveModal } from "./payments-mode-save-modal";
import { usePaymentsModeSaveStore } from "./payments-mode-store";

export function PaymentsModeSave() {
  const open = usePaymentsModeSaveStore((state) => state.open);
  if (!open) return null;
  return <PaymentsModeSaveModal />;
}

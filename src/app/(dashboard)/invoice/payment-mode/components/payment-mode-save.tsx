import { PaymentsModeSaveModal } from "./payment-mode-save-modal";
import { usePaymentsModeSaveStore } from "../payment-mode-store";

export function PaymentsModeSave() {
  const open = usePaymentsModeSaveStore((state) => state.open);
  if (!open) return null;
  return <PaymentsModeSaveModal />;
}

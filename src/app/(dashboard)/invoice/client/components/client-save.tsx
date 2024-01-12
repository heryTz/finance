import { ClientSaveModal } from "./client-save-modal";
import { useClientSaveStore } from "../client-store";

export function ClientSave() {
  const open = useClientSaveStore((state) => state.open);
  if (!open) return null;
  return <ClientSaveModal />;
}

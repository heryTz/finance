import { Alert, AlertDescription } from "src/shared/ui/alert";
import { Button } from "src/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "src/shared/ui/dialog";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  items: string[] | string;
  isLoading?: boolean;
  error?: string;
  confirmDisabled?: boolean;
};

export function ConfirmDeleteDialog({
  open,
  onClose,
  onConfirm,
  title,
  items,
  isLoading = false,
  error,
  confirmDisabled = false,
}: Props) {
  const normalized = Array.isArray(items) ? items : [items];
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {normalized.length === 1 ? (
              <>
                Are you sure you want to delete <strong>{normalized[0]}</strong>
                ? This action cannot be undone.
              </>
            ) : (
              <>
                Are you sure you want to delete these {normalized.length} items?
                This action cannot be undone.
                <ul className="mt-2 list-disc pl-4">
                  {normalized.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading || confirmDisabled}
          >
            {isLoading ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { ReactNode } from "react";

export function ConfirmationModal({
  title,
  content,
  submitLabel,
  onSubmit,
  onCancel,
  loading,
  open,
}: ConfirmationModalProps) {
  return (
    <Dialog open={open} keepMounted maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Annuler</Button>
        <Button
          color="error"
          variant="contained"
          disabled={loading}
          onClick={onSubmit}
        >
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

type ConfirmationModalProps = {
  title: string;
  content: ReactNode;
  open: boolean;
  submitLabel: string;
  onSubmit: () => void;
  onCancel: () => void;
  loading: boolean;
};

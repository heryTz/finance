import { Send } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useState } from "react";
import {
  InvoiceMailing,
  InvoiceMailingProps,
} from "../[id]/document/components/invoice-mailing";

export function InvoiceMailingAction(props: InvoiceMailingActionProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        endIcon={<Send />}
      >
        Envoyer par email
      </Button>
      {open && (
        <InvoiceMailing {...props} open onClose={() => setOpen(false)} />
      )}
    </>
  );
}

type InvoiceMailingActionProps = Pick<InvoiceMailingProps, "id" | "onSubmit">;

import { Send } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useState } from "react";
import { InvoiceMailing, InvoiceMailingProps } from "./invoice-mailing";

export function InvoiceMailingAction(props: InvoiceMailingActionProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <IconButton size="small" onClick={() => setOpen(true)}>
        <Send />
      </IconButton>
      {open && (
        <InvoiceMailing {...props} open onClose={() => setOpen(false)} />
      )}
    </>
  );
}

type InvoiceMailingActionProps = Pick<InvoiceMailingProps, "id">;

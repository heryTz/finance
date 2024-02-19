"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import jsPDF from "jspdf";
import { useState } from "react";
import { GetInvoiceById } from "../../../invoice-service";
import { GetProvider } from "@/app/(dashboard)/invoice/provider/provider-service";
import { InvoiceMailingAction } from "../../../components/invoice-mailing-action";
import { InvoicePreview } from "./invoice-preview";
import { SendInvoiceMailInput } from "../../../invoice-dto";
import { sendInvoiceMailAction } from "../../../invoice-action";
import { invoiceDetaultFilename } from "../../../components/invoice-list";

export function InvoiceDocument({ invoice, provider }: InvoiceDocumentProps) {
  const defaultFilename = invoiceDetaultFilename(invoice);
  const [filename, setFilename] = useState(defaultFilename);
  const [openSave, setOpenSave] = useState(false);

  const printFile = async () => {
    return new Promise<jsPDF>((resolve) => {
      const content = document.querySelector<HTMLDivElement>(".invoice-pdf")!;
      const pdf = new jsPDF();
      pdf.html(content, {
        callback(doc) {
          resolve(doc);
        },
        x: 5,
        y: 5,
        width: 180,
        windowWidth: 675,
      });
    });
  };

  const print = () => {
    printFile().then((doc) => {
      doc.save(filename);
      setOpenSave(false);
    });
  };

  const onCloseSave = () => {
    setFilename(defaultFilename);
    setOpenSave(false);
  };

  const onSendMail = async (
    data: Pick<SendInvoiceMailInput, "content" | "subject">,
  ) => {
    const doc = await printFile();
    const docBase64 = doc.output("datauristring");
    await sendInvoiceMailAction(invoice.id, { ...data, file: docBase64 });
  };

  return (
    <>
      <Stack direction={"column"} gap={3} alignItems={"center"}>
        <InvoicePreview
          invoice={invoice}
          provider={provider}
          invoiceClassName="invoice-pdf"
        />
        <Stack direction={"row"} justifyContent={"center"} columnGap={2}>
          <Button variant="contained" onClick={() => setOpenSave(true)}>
            Télécharger
          </Button>
          <InvoiceMailingAction id={invoice.id} onSubmit={onSendMail} />
        </Stack>
      </Stack>
      {openSave && (
        <Dialog open onClose={onCloseSave} maxWidth="sm" fullWidth>
          <DialogTitle>Téléchargement de votre facture</DialogTitle>
          <DialogContent>
            <Stack direction={"row"} gap={2} sx={{ mt: 1 }}>
              <TextField
                name="filename"
                label="Nom du fichier"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={onCloseSave}>Annuler</Button>
            <Button
              variant="contained"
              disabled={!filename}
              onClick={() => print()}
            >
              Télécharger
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

type InvoiceDocumentProps = {
  invoice: GetInvoiceById;
  provider: NonNullable<GetProvider>;
};

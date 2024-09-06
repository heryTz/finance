"use client";

import jsPDF from "jspdf";
import { useState } from "react";
import { GetInvoiceById } from "../../../invoice-service";
import { GetProvider } from "@/app/(dashboard)/invoice/provider/provider-service";
import { InvoicePreview } from "./invoice-preview";
import { sendInvoiceMailAction } from "../../../invoice-action";
import { invoiceDetaultFilename } from "../../../components/invoice-list";
import { Button } from "@/components/ui/button";
import { InvoiceDownload } from "./invoice-download";
import { InvoiceMailing } from "./invoice-mailing";
import { Container } from "@/components/container";
import { routes } from "@/app/routes";

export function InvoiceDocument({ invoice, provider }: InvoiceDocumentProps) {
  const defaultFilename = invoiceDetaultFilename(invoice);
  const [openDownload, setOpenDownload] = useState(false);
  const [openMail, setOpenMail] = useState(false);

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

  return (
    <Container
      title="Détails de la facture"
      breadcrumb={[
        { label: "Facture", path: routes.invoice() },
        { label: "Détails" },
      ]}
    >
      <div className="grid gap-4 mx-auto">
        <div className="max-w-[calc(100dvw-32px)] overflow-auto">
          <InvoicePreview
            invoice={invoice}
            provider={provider}
            invoiceClassName="invoice-pdf"
          />
        </div>
        <div className="flex justify-center items-center gap-4">
          <Button onClick={() => setOpenDownload(true)}>Télécharger</Button>
          <Button onClick={() => setOpenMail(true)}>Envoyer par email</Button>
        </div>
      </div>
      <InvoiceDownload
        defaultFilename={defaultFilename}
        open={openDownload}
        onOpenChange={setOpenDownload}
        onDownload={async (filename) => {
          const doc = await printFile();
          doc.save(filename);
        }}
      />
      <InvoiceMailing
        open={openMail}
        onOpenChange={setOpenMail}
        id={invoice.id}
        onSubmit={async (data) => {
          const doc = await printFile();
          const docBase64 = doc.output("datauristring");
          await sendInvoiceMailAction(invoice.id, {
            ...data,
            file: docBase64,
          });
        }}
      />
    </Container>
  );
}

type InvoiceDocumentProps = {
  invoice: GetInvoiceById;
  provider: NonNullable<GetProvider>;
};
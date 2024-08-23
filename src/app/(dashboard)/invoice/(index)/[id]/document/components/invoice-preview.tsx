import { GetProvider } from "@/app/(dashboard)/invoice/provider/provider-service";
import { GetInvoiceById } from "../../../invoice-service";
import dayjs from "dayjs";
import { humanAmount } from "@/lib";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function InvoicePreview({
  invoice,
  provider,
  invoiceClassName,
}: InvoicePreviewProps) {
  const providerData = [
    { label: "Nom", value: provider.name.toUpperCase() },
    { label: "Adresse", value: provider.address },
    { label: "Email", value: provider.email },
    { label: "Tel", value: provider.phone },
    { label: "NIF", value: provider.nif },
    { label: "SIREN", value: provider.siren },
    { label: "APE", value: provider.ape },
  ];

  const client = [
    { label: "Nom", value: invoice.Client.name.toUpperCase() },
    { label: "Adresse", value: invoice.Client.address },
    { label: "Email", value: invoice.Client.email },
    { label: "Tel", value: invoice.Client.phone },
    { label: "NIF", value: invoice.Client.nif },
    { label: "SIREN", value: invoice.Client.siren },
    { label: "APE", value: invoice.Client.ape },
  ];

  const products = invoice.Products.map((el) => ({
    name: el.name,
    qte: el.qte,
    price: el.price,
  }));
  const sumProductsHT = products.reduce(
    (acc, cur) => acc + cur.price * cur.qte,
    0,
  );
  const tvaAmount = (sumProductsHT * invoice.tva) / 100;

  const payments = [
    { label: "Payable à", value: invoice.Payment.name },
    { label: "IBAN", value: invoice.Payment.iban },
    { label: "Titulaire du compte", value: invoice.Payment.accountName },
  ];

  return (
    <Card style={{ width: "595.28pt", height: "841.89pt" }}>
      <div
        className={cn(invoiceClassName, "p-8 grid gap-6")}
        // TODO: jspdf cannot use the custom font, fix this later
        style={{ fontFamily: "Helvetica" }}
      >
        <div className="text-2xl text-center">
          Facture n° {invoice.ref} le{" "}
          <span contentEditable="true" suppressContentEditableWarning>
            {dayjs().format("DD/MM/YYYY")}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between gap-4">
          <PartenaireShip
            title="Prestataire"
            data={providerData.filter((el) => !!el.value) as any}
          />
          <PartenaireShip
            title="Client"
            data={client.filter((el) => !!el.value) as any}
          />
        </div>
        <Separator />
        <div className="text-xl">Description</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead className="text-right">Quantité</TableHead>
              <TableHead className="text-right">Prix unitaire HT</TableHead>
              <TableHead className="text-right w-[200px]">
                Prix total HT
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((el) => (
              <TableRow key={el.name}>
                <TableCell>{el.name}</TableCell>
                <TableCell className="text-right">{el.qte}</TableCell>
                <TableCell className="text-right">
                  {humanAmount(el.price)} {invoice.currency}
                </TableCell>
                <TableCell className="text-right">
                  {humanAmount(el.price * el.qte)} {invoice.currency}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">{`${humanAmount(sumProductsHT)} ${invoice.currency}`}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>{`TVA à ${invoice.tva}%`}</TableCell>
              <TableCell className="text-right">{`${humanAmount(tvaAmount)} ${invoice.currency}`}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3} className="font-bold">
                Total TTC
              </TableCell>
              <TableCell className="text-right font-bold">{`${humanAmount(sumProductsHT + tvaAmount)} ${
                invoice.currency
              }`}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <Separator />
        <div className="text-xl">Paiement</div>
        <div className="grid gap-1">
          {payments
            .filter((el) => !!el.value)
            .map((el) => (
              <div className="flex items-center text-sm gap-2" key={el.label}>
                <div className="font-bold w-[150px]">{el.label}:</div>
                <div>{el.value}</div>
              </div>
            ))}
        </div>
      </div>
    </Card>
  );
}

type InvoicePreviewProps = {
  invoice: GetInvoiceById;
  provider: NonNullable<GetProvider>;
  invoiceClassName: string;
};

function PartenaireShip(props: {
  title: string;
  data: { label: string; value: string }[];
}) {
  return (
    <div>
      <div className="text-xl mb-2">{props.title}</div>
      <div className="grid gap-2">
        {props.data.map((el) => (
          <div key={el.label} className="text-sm">
            <strong className="w-[70px] inline-block">{el.label}:</strong>{" "}
            {el.value}
          </div>
        ))}
      </div>
    </div>
  );
}

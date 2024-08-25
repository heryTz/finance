import { capitalizeFirstLetter } from "@/lib";
import dayjs from "dayjs";
import "dayjs/locale/fr";

export function getCurrency() {
  return ["Ar", "EUR"] as const;
}

export type Currency = ReturnType<typeof getCurrency>[number];

export function defaultInvoiceSubject() {
  const date = dayjs().locale("fr").format("MMMM YYYY");
  return `Facture de mois de ${capitalizeFirstLetter(date)}`;
}

export function defaultInvoiceContent(options: { senderName: string }) {
  const date = dayjs().locale("fr").format("MMMM YYYY");
  return `Bonjour,\n\nVoici ma facture du mois de ${capitalizeFirstLetter(
    date,
  )}.\n\nCordialement,\n\n${options.senderName}`;
}

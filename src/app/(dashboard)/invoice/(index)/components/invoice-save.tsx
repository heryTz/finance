"use client";

import { GetInvoiceById, GetProducts } from "../invoice-service";
import { createInvoiceAction, updateInvoiceAction } from "../invoice-action";
import { getCurrency, Currency } from "../invoice-util";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { CreateInvoiceInput, createInvoiceSchema } from "../invoice-dto";
import { useState, useTransition } from "react";
import { Container } from "@/components/container";
import { toast } from "sonner";
import { Form, FormField } from "@/components/ui/form";
import { AutocompleteField } from "@/components/autocomplete-field";
import { InputField } from "@/components/input-field";
import { SelectField } from "@/components/select-field";
import { CalendarField } from "@/components/calendar-field";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { routes } from "@/app/routes";
import { ClientSave } from "../../client/components/client-save";
import { CommandItem } from "@/components/ui/command";
import { useSeo } from "@/lib/use-seo";
import { useGetInvoiceClients } from "../../client/client-query";
import { useGetPaymentModes } from "../../payment-mode/payment-mode-query";
import { PaymentModeSave } from "../../payment-mode/components/payment-mode-save";
import { ComboboxField } from "@/components/combobox-field";

export function InvoiceSave({ products, invoice }: InvoiceSaveFormProps) {
  const [isPending, startTransition] = useTransition();
  const { back } = useRouter();
  const clientsFn = useGetInvoiceClients();
  const paymentModesFn = useGetPaymentModes();
  const [openClientModal, setOpenClientModal] = useState(false);
  const [openPaymentModeModal, setOpenPaymentModeModal] = useState(false);
  const invoiceParsed = invoice
    ? createInvoiceSchema.parse({ ...invoice, products: invoice.Products })
    : null;
  const form = useForm<CreateInvoiceInput>({
    defaultValues: {
      tva: invoiceParsed?.tva ?? 0,
      products: invoiceParsed?.products ?? [],
      clientId: invoiceParsed?.clientId,
      currency: invoiceParsed?.currency as Currency,
      paymentModeId: invoiceParsed?.paymentModeId,
      createdAt: invoiceParsed?.createdAt ?? new Date(),
    },
    resolver: zodResolver(createInvoiceSchema),
  });
  const productsField = useFieldArray({
    control: form.control,
    name: "products",
  });

  const onSubmit = form.handleSubmit(async (data) => {
    startTransition(async () => {
      try {
        if (invoice) {
          await updateInvoiceAction(invoice.id, data);
          toast.success("La facture a été modifiée avec succès.");
        } else {
          await createInvoiceAction(data);
          toast.success("La facture a été créée avec succès.");
        }
      } catch (error) {
        toast.error("Une erreur s'est produite.");
      }
    });
  });

  const title = invoice
    ? `Modification de la facture "No ${invoice.ref}"`
    : "Créer une facture";

  useSeo({ title });

  return (
    <Container
      title={title}
      breadcrumb={[
        { label: "Facture", path: routes.invoice() },
        { label: invoice ? "Modification" : "Création" },
      ]}
    >
      <Form {...form}>
        <form className="grid gap-4">
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <ComboboxField
                label="Client *"
                placeholder="Sélectionner un client"
                searchPlaceholder="Chercher un client"
                emptySearchMessage="Aucun client"
                value={field.value}
                onChange={field.onChange}
                options={
                  clientsFn.data?.results.map((el) => ({
                    value: el.id,
                    label: el.name,
                  })) ?? []
                }
                actions={
                  <CommandItem
                    className="cursor-pointer"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => setOpenClientModal(true)}
                  >
                    <PlusIcon className="mr-2 w-4 h-4" />
                    <span>Ajouter un client</span>
                  </CommandItem>
                }
              />
            )}
          />
          <FormField
            control={form.control}
            name={`currency`}
            render={({ field }) => (
              <ComboboxField
                label="Devise *"
                placeholder="Sélectionner une devise"
                searchPlaceholder="Chercher une devise"
                emptySearchMessage="Aucune devise"
                value={field.value}
                onChange={field.onChange}
                options={getCurrency().map((el) => ({ value: el, label: el }))}
              />
            )}
          />
          <FormField
            control={form.control}
            name="paymentModeId"
            render={({ field }) => (
              <ComboboxField
                label="Mode de paiement *"
                placeholder="Sélectionner un mode de paiement"
                searchPlaceholder="Chercher un mode de paiement"
                emptySearchMessage="Aucun mode de paiement"
                value={field.value}
                onChange={field.onChange}
                options={
                  paymentModesFn.data?.results.map((el) => ({
                    label: el.name,
                    value: el.id,
                  })) ?? []
                }
                actions={
                  <CommandItem
                    className="cursor-pointer"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => setOpenPaymentModeModal(true)}
                  >
                    <PlusIcon className="mr-2 w-4 h-4" />
                    <span>Ajouter un mode de paiement</span>
                  </CommandItem>
                }
              />
            )}
          />
          <FormField
            control={form.control}
            name="tva"
            render={({ field }) => (
              <InputField
                type="number"
                label="TVA (%)"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <FormField
            control={form.control}
            name="createdAt"
            render={({ field }) => (
              <CalendarField
                label="Date de création"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <p className="font-semibold text-lg underline mt-2">Produits</p>
          <div className="grid gap-4">
            {productsField.fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-4">
                <Button
                  variant={"destructive"}
                  size={"icon"}
                  onClick={() => productsField.remove(index)}
                >
                  <TrashIcon />
                </Button>
                <div className="flex items-start gap-4 w-full">
                  <FormField
                    control={form.control}
                    name={`products.${index}.name`}
                    render={({ field: fieldName }) => (
                      <AutocompleteField
                        label="Nom *"
                        formItemProps={{ className: "flex-1" }}
                        value={fieldName.value}
                        onChange={fieldName.onChange}
                        options={products.results.map((el) => ({
                          value: el.name,
                          label: el.name,
                        }))}
                      />
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`products.${index}.price`}
                    render={({ field }) => (
                      <InputField
                        type="number"
                        label="Prix unitaire *"
                        {...field}
                      />
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`products.${index}.qte`}
                    render={({ field }) => (
                      <InputField type="number" label="Quantité *" {...field} />
                    )}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant={"secondary"}
              className="mx-auto"
              onClick={() =>
                productsField.append({
                  name: "",
                  price: 0,
                  qte: 1,
                })
              }
            >
              Ajouter un produit
            </Button>
          </div>
          <Separator />
          <div className="flex justify-center gap-4">
            <Button variant={"outline"} onClick={back}>
              Annuler
            </Button>
            <Button disabled={isPending} onClick={onSubmit}>
              Sauvegarder
            </Button>
          </div>
        </form>
      </Form>
      <ClientSave
        open={openClientModal}
        onOpenChange={setOpenClientModal}
        onFinish={(newClient) => {
          form.setValue("clientId", newClient.id);
          clientsFn.refetch();
        }}
      />
      <PaymentModeSave
        open={openPaymentModeModal}
        onOpenChange={setOpenPaymentModeModal}
        onFinish={(newPaymentMode) => {
          form.setValue("paymentModeId", newPaymentMode.id);
          paymentModesFn.refetch();
        }}
      />
    </Container>
  );
}

type InvoiceSaveFormProps = {
  products: GetProducts;
  invoice?: GetInvoiceById;
};

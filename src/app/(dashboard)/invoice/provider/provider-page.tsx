"use client";
import { useSaveProvider } from "./provider-query";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  saveProviderInputSchema,
  type SaveProviderInput,
} from "./provider-dto";
import { GetProvider } from "./provider-service";
import { toast } from "sonner";
import { Container } from "@/components/container";
import { Form, FormField } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "@/components/input-field";
import { Button } from "@/components/ui/button";

type FormValue = SaveProviderInput;

export default function ProviderPage({ provider }: ProviderPageProps) {
  const router = useRouter();
  const saveFn = useSaveProvider();
  const form = useForm<FormValue>({
    resolver: zodResolver(saveProviderInputSchema),
  });

  useEffect(() => {
    if (provider) form.reset(saveProviderInputSchema.parse(provider));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await saveFn.mutateAsync(data);
      toast.success("Configuration enregistrée");
      router.refresh();
    } catch (error) {
      toast.error("Erreur s'est produite");
    }
  });

  const onCancel = () => {
    router.back();
  };

  return (
    <Container title="Information du prestataire">
      <Form {...form}>
        <form className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => <InputField label="Nom *" {...field} />}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <InputField label="Adresse *" {...field} />
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <InputField label="Email *" {...field} type="email" />
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <InputField label="Téléphone *" {...field} />
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nif"
              render={({ field }) => <InputField label="NIF" {...field} />}
            />
            <FormField
              control={form.control}
              name="siren"
              render={({ field }) => <InputField label="Siren" {...field} />}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="ape"
              render={({ field }) => <InputField label="APE" {...field} />}
            />
          </div>
          <div className="flex justify-center gap-4">
            <Button variant={"outline"} onClick={onCancel}>
              Annuler
            </Button>
            <Button onClick={onSubmit} disabled={saveFn.isLoading}>
              Sauvegarder
            </Button>
          </div>
        </form>
      </Form>
    </Container>
  );
}

type ProviderPageProps = {
  provider: GetProvider;
};

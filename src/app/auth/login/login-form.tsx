"use client";

import { Feedback } from "@/components/feedback";
import { InputField } from "@/components/input-field";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zd } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

const schema = zd.object({
  email: zd.string().email(),
});

type Input = zd.infer<typeof schema>;

export function LoginForm() {
  const params = useSearchParams();
  const error = params.get("error");

  const form = useForm<Input>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });
  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = form.handleSubmit(async (data: Input) => {
    const response = await signIn("email", {
      email: data.email,
      callbackUrl: "/",
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <Card>
          {!!error && (
            <div className="p-6 pb-0">
              <Feedback
                title="Erreur"
                description="L'e-mail n'a pas pu être envoyé."
              />
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-2xl">Connexion</CardTitle>
            <CardDescription>
              Entrer votre email pour accéder à votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <InputField
                  {...field}
                  type="email"
                  label="Email"
                  placeholder="m@example.com"
                />
              )}
            />
          </CardContent>
          <CardFooter>
            <Button disabled={isSubmitting} className="w-full">
              Se connecter
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

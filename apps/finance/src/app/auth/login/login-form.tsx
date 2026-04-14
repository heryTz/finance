"use client";

import { routes } from "@/app/routes";
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
import { zd } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

const schema = zd.object({
  email: zd.email(),
});

type Input = zd.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

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
    setError(null);
    const { error } = await authClient.signIn.magicLink({
      email: data.email,
      callbackURL: routes.dashboard(),
    });

    if (error) {
      setError("L'e-mail n'a pas pu être envoyé.");
      return;
    }

    router.push(routes.authVerifyRequest());
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <Card>
          {!!error && (
            <div className="p-6 pb-0">
              <Feedback title="Erreur" description={error} />
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

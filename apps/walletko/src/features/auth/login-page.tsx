import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell } from "src/features/auth/components/auth-shell";
import { useAppForm } from "src/shared/form/form-setup";
import { authClient } from "src/shared/lib/auth-client";
import { Alert, AlertDescription } from "src/shared/ui/alert";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
});

export function LoginPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useAppForm({
    defaultValues: { email: "" },
    validators: { onSubmit: loginSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email: value.email,
        type: "sign-in",
      });
      if (error) {
        setServerError(error.message ?? "Failed to send code. Try again.");
        return;
      }
      await navigate({ to: "/login/verify", search: { email: value.email } });
    },
  });

  return (
    <AuthShell
      title="Welcome to Walletko"
      description="Enter your email to sign in or create an account."
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.AppField name="email">
          {(field) => (
            <field.InputField
              label="Email address"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@example.com"
            />
          )}
        </form.AppField>

        {serverError && (
          <Alert variant="destructive">
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

        <form.AppForm>
          <form.SubmitButton className="w-full cursor-pointer">
            Send code
          </form.SubmitButton>
        </form.AppForm>
      </form>
    </AuthShell>
  );
}

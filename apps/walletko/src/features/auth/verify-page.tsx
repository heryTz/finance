import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { AuthShell } from "src/features/auth/components/auth-shell";
import { useAppForm } from "src/shared/form/form-setup";
import { authClient } from "src/shared/lib/auth-client";
import { z } from "zod";

const routeApi = getRouteApi("/login_/verify");

const RESEND_COOLDOWN = 30;

const verifySchema = z.object({
  otp: z.string().length(6, "Enter all 6 digits"),
});

export function VerifyPage() {
  const navigate = useNavigate();
  const { email } = routeApi.useSearch();
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const form = useAppForm({
    defaultValues: { otp: "" },
    validators: { onSubmit: verifySchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const { error } = await authClient.signIn.emailOtp({
        email: email ?? "",
        otp: value.otp,
      });
      if (error) {
        form.setFieldValue("otp", "");
        setServerError(error.message ?? "Invalid code. Please try again.");
        return;
      }
      await navigate({ to: "/" });
    },
  });

  const handleResend = async () => {
    if (cooldown > 0 || !email) return;
    await authClient.emailOtp.sendVerificationOtp({ email, type: "sign-in" });
    setCooldown(RESEND_COOLDOWN);
    setServerError(null);
  };

  return (
    <AuthShell
      title="Check your email"
      description={
        <>
          We sent a 6-digit code to{" "}
          <span className="font-medium text-foreground">
            {email ?? "your email"}
          </span>
        </>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-5"
      >
        <form.AppField
          name="otp"
          validators={{
            onChange: () => {
              setServerError(null);
              return undefined;
            },
          }}
        >
          {(field) => (
            <field.OtpField
              label="Verification code"
              serverError={serverError}
            />
          )}
        </form.AppField>

        <form.AppForm>
          <form.SubmitButton className="w-full cursor-pointer">
            Verify
          </form.SubmitButton>
        </form.AppForm>

        <div className="flex items-center justify-between text-sm">
          <Link
            to="/login"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Back
          </Link>

          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0}
            className="text-muted-foreground hover:text-foreground transition-colors disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
          </button>
        </div>
      </form>
    </AuthShell>
  );
}

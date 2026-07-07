import { createFileRoute, useRouter } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { updateUserNameFn } from "src/server/functions/user.fn";
import { useAppForm } from "src/shared/form/form-setup";
import { useAuthenticatedUser } from "src/shared/hooks/use-authenticated-user";
import { PageContent, PageHeader } from "src/shared/layout/page";
import { cn } from "src/shared/lib/utils";
import { Alert, AlertDescription } from "src/shared/ui/alert";
import { Card, CardContent } from "src/shared/ui/card";
import { z } from "zod";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

const updateNameSchema = z.object({
  name: z.string().trim().min(1, "Name cannot be empty."),
});

function SettingsPage() {
  const user = useAuthenticatedUser();
  const router = useRouter();
  const [showSaved, setShowSaved] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (!showSaved) return;
    const timer = setTimeout(() => setShowSaved(false), 2000);
    return () => clearTimeout(timer);
  }, [showSaved]);

  const form = useAppForm({
    defaultValues: { name: user.name ?? "" },
    validators: { onSubmit: updateNameSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        await updateUserNameFn({ data: value });
        setShowSaved(true);
        router.invalidate();
      } catch {
        setServerError("Failed to save. Please try again.");
      }
    },
  });

  return (
    <PageContent>
      <PageHeader title="Settings" />

      <div className="max-w-sm">
        <Card>
          <CardContent className="pt-5 pb-5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Profile
                </h2>

                <form.AppField name="name">
                  {(field) => (
                    <field.InputField
                      label="Name"
                      placeholder="Your name"
                      required
                    />
                  )}
                </form.AppField>

                {serverError && (
                  <Alert variant="destructive">
                    <AlertDescription>{serverError}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="flex items-center gap-3">
                <form.AppForm>
                  <form.Subscribe
                    selector={(s) =>
                      s.values.name.trim() === (user.name ?? "").trim()
                    }
                  >
                    {(isUnchanged) => (
                      <form.SubmitButton disabled={isUnchanged}>
                        Save
                      </form.SubmitButton>
                    )}
                  </form.Subscribe>
                </form.AppForm>

                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 text-sm font-medium text-income transition-opacity duration-300",
                    showSaved ? "opacity-100" : "opacity-0 pointer-events-none",
                  )}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <CheckCircle2 className="size-4" />
                  Saved!
                </span>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContent>
  );
}

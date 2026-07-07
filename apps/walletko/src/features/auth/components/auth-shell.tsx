import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/shared/ui/card";
import { Logo } from "src/shared/ui/logo";

type AuthShellProps = {
  title: string;
  description: ReactNode;
  children: ReactNode;
};

export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
      />
      <div className="relative w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2">
          <Logo className="size-12" />
          <span className="text-lg font-semibold tracking-tight">Walletko</span>
        </div>
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}

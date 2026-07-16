import { createFileRoute } from "@tanstack/react-router";
import { GithubIcon } from "lucide-react";
import { useAppMeta } from "src/shared/hooks/use-app-meta";
import { PageContent, PageHeader } from "src/shared/layout/page";
import { Button } from "src/shared/ui/button";
import { Logo } from "src/shared/ui/logo";

export const Route = createFileRoute("/_authenticated/about")({
  component: AboutPage,
});

const GITHUB_URL = "https://github.com/heryTz/walletko";

const APP_DESCRIPTION =
  "Walletko helps you organize your money into pots and stay on top of income, expenses, and transfers.";

function formatReleaseDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium tabular-nums">{value}</span>
    </div>
  );
}

function AboutPage() {
  const { version, releaseDate } = useAppMeta();

  return (
    <PageContent>
      <PageHeader eyebrow="About" title="Walletko" />

      <div className="flex items-center gap-3">
        <Logo className="size-10 shrink-0" />
        <p className="text-sm text-muted-foreground">{APP_DESCRIPTION}</p>
      </div>

      <div className="divide-y divide-border rounded-xl border border-border px-4">
        <MetaRow label="Version" value={`v${version}`} />
        {releaseDate && (
          <MetaRow label="Released" value={formatReleaseDate(releaseDate)} />
        )}
      </div>

      <div>
        <Button
          variant="outline"
          nativeButton={false}
          render={
            <a href={GITHUB_URL} target="_blank" rel="noreferrer">
              <GithubIcon className="size-4" />
              View on GitHub
            </a>
          }
        />
      </div>
    </PageContent>
  );
}

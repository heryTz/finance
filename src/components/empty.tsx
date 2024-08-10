import { ReactNode } from "react";
import { Button } from "./ui/button";
import Link from "next/link";

export function Empty({ title, description, cta }: EmptyProps) {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        {cta?.onClick && (
          <Button className="mt-4" onClick={cta.onClick}>
            {cta.label}
          </Button>
        )}
        {cta?.href && (
          <Button className="mt-4" asChild>
            <Link href={cta.href}>{cta.label}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}

type EmptyProps = {
  title: string;
  description: ReactNode;
  cta?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
};

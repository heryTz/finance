import { Empty } from "./empty";

export function ErrorSection({ message }: ErrorSectionProps) {
  return (
    <Empty
      withBorder
      title="Erreur"
      description={message ?? "Oups ! quelque chose s'est mal passé"}
      cta={{
        onClick: () => window.location.reload(),
        label: "Recharger la page",
      }}
    />
  );
}

type ErrorSectionProps = { message?: string };

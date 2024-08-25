import { Empty } from "@/components/empty";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-dvh">
      <Empty
        title="Page introuvable"
        description="Impossible de trouver la ressource demandée."
        cta={{
          href: "/",
          label: "Revenir dans le dashboard",
        }}
      />
    </div>
  );
}

"use client";

import { Empty } from "@/components/empty";
import { useEffect } from "react";
import { routes } from "./routes";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-dvh">
      <Empty
        title="Error 500"
        description={"Une erreur est survenue. Veuillez réessayer."}
        cta={{
          href: routes.dashboard(),
          label: "Revenir dans le dashboard",
        }}
      />
    </div>
  );
}

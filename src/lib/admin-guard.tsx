"use client";
import { Loader } from "@/components/loader";
import { authClient } from "@/lib/auth-client";
import { routes } from "@/app/routes";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace(routes.authLogin());
    }
  }, [isPending, session, router]);

  if (isPending) return <Loader />;
  if (!session) return null;

  return <>{children}</>;
}

type AdminGuardProps = PropsWithChildren;

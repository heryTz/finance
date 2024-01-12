"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";

// TODO: improve this
export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace(`/api/auth/signin`);
    },
  });

  if (status === "loading") return "Loading...";

  return <>{children}</>;
}

type AdminGuardProps = PropsWithChildren<{}>;

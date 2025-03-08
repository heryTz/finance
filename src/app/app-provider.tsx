"use client";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setupLang } from "@/lang/config";
import { NuqsAdapter } from "nuqs/adapters/next/app";

setupLang();

const queryClient = new QueryClient();

export function AppProvider({ children, session }: AppProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <SessionProvider session={session}>{children}</SessionProvider>
      </NuqsAdapter>
    </QueryClientProvider>
  );
}

type AppProviderProps = PropsWithChildren<{ session: Session | null }>;

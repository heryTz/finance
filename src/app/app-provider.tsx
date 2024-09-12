"use client";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setupLang } from "@/lang/config";

setupLang();

const queryClient = new QueryClient();

export function AppProvider({ children, session }: AppProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>{children}</SessionProvider>
    </QueryClientProvider>
  );
}

type AppProviderProps = PropsWithChildren<{ session: Session | null }>;

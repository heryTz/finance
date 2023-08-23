"use client";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const queryClient = new QueryClient();

export function AppProvider({ children, session }: AppProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <SessionProvider session={session}>{children}</SessionProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
}

type AppProviderProps = PropsWithChildren<{ session: Session | null }>;

"use client";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SnackbarProvider } from "notistack";

const queryClient = new QueryClient();

export function AppProvider({ children, session }: AppProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <SessionProvider session={session}>{children}</SessionProvider>
        </LocalizationProvider>
      </SnackbarProvider>
    </QueryClientProvider>
  );
}

type AppProviderProps = PropsWithChildren<{ session: Session | null }>;

import "./globals.css";
import type { Metadata } from "next";
import { AppProvider } from "./app-provider";
import { getServerSession } from "next-auth";
import { CssBaseline } from "@mui/material";
import { authOptions } from "./api/auth/[...nextauth]/options";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "FINANCE",
  description: "FINANCE application",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <CssBaseline />
        <AppProvider session={session}>{children}</AppProvider>
      </body>
    </html>
  );
}

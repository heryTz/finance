import "./globals.css";
import "./font-setup";
import type { Metadata } from "next";
import { AppProvider } from "./app-provider";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Finance",
  description: "Finance application",
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
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </head>
      <body className={cn("min-h-dvh bg-background font-sans antialiased")}>
        <div vaul-drawer-wrapper="" className="min-h-dvh bg-background">
          <AppProvider session={session}>{children}</AppProvider>
        </div>
        <Toaster />
        <div id="ReactModalPortal" />
      </body>
    </html>
  );
}

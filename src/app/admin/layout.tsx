import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../app/globals.css";
import { cn } from "@/lib/utils";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "../../context/Auth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Barbearia do Márcio",
  description: "Ser comum não é uma opção.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" sizes="any" />
      </head>

      <body
        className={cn(
          "min-h-screen bg-zinc-100 font-sans antialiased",
          inter.variable
        )}
      >
        <AuthProvider>{children}</AuthProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}

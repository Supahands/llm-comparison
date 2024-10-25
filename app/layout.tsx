"use client";

import { Lato, EB_Garamond } from "next/font/google";
import { ConfirmDialogProvider } from "@omit/react-confirm-dialog";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const lato = Lato({
  subsets: ["latin"],
  display: "auto",
  weight: ["400", "700", "900"],
});

export const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  display: "auto",
  weight: ["400", "700", "600"],
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-llm-background">
      <QueryClientProvider client={queryClient}>
        <ConfirmDialogProvider>
          <body
            className={`${lato.className} antialiased h-full py-9 px-16 bg-llm-background`}
          >
            {children}
          </body>
        </ConfirmDialogProvider>
      </QueryClientProvider>
    </html>
  );
}

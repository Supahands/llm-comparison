"use client";

import { ConfirmDialogProvider } from "@omit/react-confirm-dialog";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lato } from "./font-import";


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
            className={`${lato.className} antialiased h-full lg:!px-10 px-2 bg-llm-background`}
          >
            {children}
          </body>
        </ConfirmDialogProvider>
      </QueryClientProvider>
    </html>
  );
}

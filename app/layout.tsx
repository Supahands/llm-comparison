"use client";

import { Lato, EB_Garamond } from "next/font/google";
import { ConfirmDialogProvider } from "@omit/react-confirm-dialog";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-llm-background">
      <ConfirmDialogProvider>
        <body
          className={`${lato.className} antialiased h-full py-9 px-16 bg-llm-background`}
        >
          {children}
        </body>
      </ConfirmDialogProvider>
    </html>
  );
}

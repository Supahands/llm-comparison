"use client";

import { ConfirmDialogProvider } from "@omit/react-confirm-dialog";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lato } from "./font-import";
import { Toaster } from "@/components/ui/toaster";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";
import posthog from "posthog-js";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageleave: false,
      capture_pageview: false,
      autocapture: false,
    });
  }, []);

  return (
    <html lang="en" className="h-full bg-llm-background">
      <PostHogProvider client={posthog}>
        <QueryClientProvider client={queryClient}>
          <ConfirmDialogProvider>
            <body
              className={`${lato.className} antialiased h-full lg:!px-10 px-2 bg-llm-background`}
            >
              {children}
              <Toaster />
            </body>
          </ConfirmDialogProvider>
        </QueryClientProvider>
      </PostHogProvider>
    </html>
  );
}

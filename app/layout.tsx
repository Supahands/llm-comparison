"use client";

import { ConfirmDialogProvider } from "@omit/react-confirm-dialog";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lato } from "./font-import";
import { Toaster } from "../components/ui/toaster";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";
import posthog from "posthog-js";
import { metadata } from "./metadata";

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

    posthog.identify();
  }, []);

  return (
    <html lang="en" className="h-full bg-llm-background">
      <PostHogProvider client={posthog}>
        <QueryClientProvider client={queryClient}>
          <ConfirmDialogProvider>
            <head>
              <title>Compare LLM Models</title>

              {/* OpenGraph */}
              <meta property="og:title" content="Compare LLM Models" />
              <meta
                property="og:image"
                content="https://cdn.prod.website-files.com/63024b20439fa61d4aee344c/6729815170f000c58463873c_select%20models-p-800.jpg"
              />
              <meta
                property="og:description"
                content="Compare LLMs to find out which one fits your needs best!"
              />
              <meta property="og:url" content="https://eval.supa.so" />

              {/* Twitter */}
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:title" content="Compare LLM Models" />
              <meta
                name="twitter:description"
                content="Compare LLMs to find out which one fits your needs best!"
              />
              <meta
                name="twitter:image"
                content="https://cdn.prod.website-files.com/63024b20439fa61d4aee344c/6729815170f000c58463873c_select%20models-p-800.jpg"
              />
              <meta name="twitter:url" content="https://eval.supa.so" />

              {process.env.NODE_ENV === "production" &&
                process.env.NEXT_PUBLIC_GA_TRACKING_ID && (
                  <>
                    <script
                      async
                      src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`}
                    ></script>
                    <script
                      dangerouslySetInnerHTML={{
                        __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}', { page_path: window.location.pathname });
                `,
                      }}
                    />
                  </>
                )}
            </head>
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

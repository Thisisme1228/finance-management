import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from "next/font/google";
import ReactQueryProvider from "./ReactQueryProvider";
import ReduxProviderWrapper from "@/store/provider";
import { Toaster } from "@/components/ui/toaster";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { fileRouter } from "./api/uploadthing/core";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | finance management platform",
    default: "finance management platform",
  },
  description: "a ssas platform for managing your finances",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className}`}>
        <NextSSRPlugin routerConfig={extractRouterConfig(fileRouter)} />
        <ReactQueryProvider>
          <ReduxProviderWrapper>{children}</ReduxProviderWrapper>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}

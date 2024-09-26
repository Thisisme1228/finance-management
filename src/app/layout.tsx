import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from "next/font/google";
import ReactQueryProvider from "./ReactQueryProvider";
import ReduxProviderWrapper from "@/store/provider";
import { Toaster } from "@/components/ui/toaster";

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
        <ReactQueryProvider>
          <ReduxProviderWrapper>{children}</ReduxProviderWrapper>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}

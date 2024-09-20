import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import ReactQueryProvider from "./ReactQueryProvider";

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
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

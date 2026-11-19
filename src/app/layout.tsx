import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./kiiikiii.css";
import { ThemeProvider } from "@/components/shared/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "NewTix - Online Concert & Event Ticketing",
    template: "%s | NewTix",
  },
  description:"Book concert, fan meeting and festival tickets online. Safe tickets, honest live quota, instant QR pass.",};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={inter.variable}
    >
      <body className="min-h-screen bg-background text-foreground antialiased relative selection:bg-bubblegum selection:text-[#1B1B1B]">
        <ThemeProvider
          attribute="class"
          defaultTheme="light" forcedTheme="light"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

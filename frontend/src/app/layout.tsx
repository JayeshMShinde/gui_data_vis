import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SessionProvider } from "@/contexts/SessionContext";
import QueryProvider from "@/components/QueryProvider";
import AuthToasts from "@/components/AuthToasts";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DataViz Pro - Data Visualization & ML Platform",
  description: "Complete data science platform for analysis, visualization, and machine learning",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider>
            <SessionProvider>
              <QueryProvider>
                <AuthToasts />
                {children}
                <Toaster position="top-right" />
              </QueryProvider>
            </SessionProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
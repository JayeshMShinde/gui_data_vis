import "./globals.css"
import { ReactNode } from "react"
import QueryProvider from "@/components/QueryProvider"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { Toaster } from "sonner"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <QueryProvider>
            {children}
            <Toaster position="top-right" />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
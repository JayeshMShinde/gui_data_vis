import "./globals.css"
import { ReactNode } from "react"
import QueryProvider from "@/components/QueryProvider"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { SessionProvider } from "@/contexts/SessionContext"
import { Toaster } from "sonner"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <SessionProvider>
            <QueryProvider>
              {children}
              <Toaster 
                position="top-right" 
                toastOptions={{
                  className: 'dark:bg-gray-800 dark:text-white dark:border-gray-700',
                }}
              />
            </QueryProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
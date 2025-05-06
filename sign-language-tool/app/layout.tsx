import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { LayoutWrapper } from "@/components/layout-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SLAT - Sign Language Analysis Tool",
  description: "A modern tool for sign language detection and translation",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white dark:from-gray-900 dark:via-indigo-950/30 dark:to-gray-800 ${inter.className}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
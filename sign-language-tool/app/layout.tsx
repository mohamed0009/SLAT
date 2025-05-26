import React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import { LayoutWrapper } from "@/components/layout-wrapper"
import ErrorBoundary from "@/components/ErrorBoundary"
import SystemNotifications from "@/components/SystemNotifications"
import GlobalErrorHandler from "@/components/GlobalErrorHandler"
import { Toaster } from "@/components/ui/toaster"
import { AnimatedBackground } from "@/components/animated-background"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' })
const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: '--font-poppins',
})

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
      <body className={`min-h-screen font-sans ${inter.variable} ${poppins.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ErrorBoundary>
            <AnimatedBackground />
            <div className="relative z-10">
              <GlobalErrorHandler />
              <>
                <div className="fixed top-2 right-2 z-50 bg-indigo-600 text-white text-xs px-2 py-1 rounded-md shadow-md">
                  <Link href="http://localhost:3000" className="hover:text-indigo-200 transition-colors">
                    localhost:3000
                  </Link>
                </div>
                <LayoutWrapper>{children}</LayoutWrapper>
                <SystemNotifications />
                <Toaster />
              </>
            </div>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}
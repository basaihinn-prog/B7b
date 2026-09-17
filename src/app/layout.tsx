import type { Metadata } from "next"
import { Geist } from "next/font/google"

import { TooltipProvider } from "@/components/ui/tooltip"

import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

export const metadata: Metadata = {
  title: {
    default: "Ahmed Bet Admin",
    template: "%s | Ahmed Bet Admin",
  },
  description: "Ahmed Bet administration panel",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} min-h-screen antialiased`}>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  )
}

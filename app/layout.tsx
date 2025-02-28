import { TopNav } from "@/components/top-nav"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "管理平台",
  description: "使用 Next.js 构建的现代管理平台",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {



  return (
    <html lang="zh">
      <body className={inter.className}>
        <div className="flex flex-col h-screen bg-gray-100">
          <TopNav />
          <main className="flex-1 overflow-y-auto p-8">{children}</main>
        </div>
      </body>
    </html>
  )
}
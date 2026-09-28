"use client"

import { usePathname } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/agents": "Agents",
  "/players": "Players",
  "/wallets": "Wallets",
  "/transactions": "Transactions",
  "/providers": "Providers",
  "/games": "Games",
  "/game-launcher": "Game Launcher",
  "/sessions": "Game Sessions",
  "/audit-logs": "Audit Logs",
  "/system": "System",
}

export function AdminHeader() {
  const pathname = usePathname()

  const rootPath = `/${pathname.split("/").filter(Boolean)[0] || "dashboard"}`
  const title = titles[rootPath] ?? "Ahmed Bet Admin"

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur">
      <SidebarTrigger className="-ml-1" />

      <Separator orientation="vertical" className="h-4" />

      <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
        <div>
          <p className="truncate text-sm font-semibold">{title}</p>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Ahmed Bet administration
          </p>
        </div>

        <Badge variant="outline" className="hidden sm:inline-flex">
          Production
        </Badge>
      </div>
    </header>
  )
}

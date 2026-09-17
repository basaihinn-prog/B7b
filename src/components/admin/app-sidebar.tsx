"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Activity,
  ArrowLeftRight,
  Boxes,
  Gamepad2,
  LayoutDashboard,
  LogOut,
  ScrollText,
  ServerCog,
  ShieldCheck,
  Users,
  UserRound,
  WalletCards,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type SidebarUser = {
  username: string
  email: string | null
}

const groups = [
  {
    label: "General",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "User Management",
    items: [
      {
        title: "Agents",
        href: "/agents",
        icon: Users,
      },
      {
        title: "Players",
        href: "/players",
        icon: UserRound,
      },
    ],
  },
  {
    label: "Finance",
    items: [
      {
        title: "Wallets",
        href: "/wallets",
        icon: WalletCards,
      },
      {
        title: "Transactions",
        href: "/transactions",
        icon: ArrowLeftRight,
      },
    ],
  },
  {
    label: "Gaming",
    items: [
      {
        title: "Providers",
        href: "/providers",
        icon: Boxes,
      },
      {
        title: "Games",
        href: "/games",
        icon: Gamepad2,
      },
      {
        title: "Sessions",
        href: "/sessions",
        icon: Activity,
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        title: "Audit Logs",
        href: "/audit-logs",
        icon: ScrollText,
      },
      {
        title: "System",
        href: "/system",
        icon: ServerCog,
      },
    ],
  },
]

export function AppSidebar({
  user,
}: {
  user: SidebarUser
}) {
  const pathname = usePathname()
  const router = useRouter()

  async function logout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })
    } finally {
      router.replace("/login")
      router.refresh()
    }
  }

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Gamepad2 className="size-4" />
                </div>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Ahmed Bet
                  </span>

                  <span className="truncate text-xs text-muted-foreground">
                    Admin Panel
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>
              {group.label}
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`)

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.title}
                      >
                        <Link href={item.href}>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip={user.username}
            >
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                <ShieldCheck className="size-4 text-primary" />
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user.username}
                </span>

                <span className="truncate text-xs text-muted-foreground">
                  {user.email ?? "Administrator"}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={logout}
              tooltip="Sign out"
              className="text-destructive"
            >
              <LogOut className="size-4" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

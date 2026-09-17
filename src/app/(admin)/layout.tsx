import { redirect } from "next/navigation"

import { AdminHeader } from "@/components/admin/admin-header"
import { AppSidebar } from "@/components/admin/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { getAuthenticatedAdmin } from "@/lib/server/auth"

export const dynamic = "force-dynamic"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getAuthenticatedAdmin()

  if (!user) {
    redirect("/login")
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />

      <SidebarInset>
        <AdminHeader />

        <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

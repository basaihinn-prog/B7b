import { AdminModuleClient } from "@/components/admin/admin-module-client"

export const dynamic = "force-dynamic"

export default function Page() {
  return <AdminModuleClient kind="players" />
}

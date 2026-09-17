import { Users } from "lucide-react"
import { ModulePlaceholder } from "@/components/admin/module-placeholder"

export default function AgentsPage() {
  return (
    <ModulePlaceholder
      title="Agents"
      description="Manage platform agents, status, wallets and permissions."
      icon={Users}
    />
  )
}

import { UserRound } from "lucide-react"
import { ModulePlaceholder } from "@/components/admin/module-placeholder"

export default function PlayersPage() {
  return (
    <ModulePlaceholder
      title="Players"
      description="Manage players, account status and wallet activity."
      icon={UserRound}
    />
  )
}

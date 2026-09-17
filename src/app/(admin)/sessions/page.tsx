import { Activity } from "lucide-react"
import { ModulePlaceholder } from "@/components/admin/module-placeholder"

export default function SessionsPage() {
  return (
    <ModulePlaceholder
      title="Game Sessions"
      description="Monitor active and historical game sessions."
      icon={Activity}
    />
  )
}

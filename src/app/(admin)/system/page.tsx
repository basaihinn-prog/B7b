import { ServerCog } from "lucide-react"
import { ModulePlaceholder } from "@/components/admin/module-placeholder"

export default function SystemPage() {
  return (
    <ModulePlaceholder
      title="System"
      description="System health, backend status and operational configuration."
      icon={ServerCog}
    />
  )
}

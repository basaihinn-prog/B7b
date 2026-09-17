import { ScrollText } from "lucide-react"
import { ModulePlaceholder } from "@/components/admin/module-placeholder"

export default function AuditLogsPage() {
  return (
    <ModulePlaceholder
      title="Audit Logs"
      description="Review administrative and security-sensitive activity."
      icon={ScrollText}
    />
  )
}

import { Boxes } from "lucide-react"
import { ModulePlaceholder } from "@/components/admin/module-placeholder"

export default function ProvidersPage() {
  return (
    <ModulePlaceholder
      title="Providers"
      description="Manage game providers, endpoints and provider status."
      icon={Boxes}
    />
  )
}

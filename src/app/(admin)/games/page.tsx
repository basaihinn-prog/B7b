import { Gamepad2 } from "lucide-react"
import { ModulePlaceholder } from "@/components/admin/module-placeholder"

export default function GamesPage() {
  return (
    <ModulePlaceholder
      title="Games"
      description="Manage the game catalog, providers and availability."
      icon={Gamepad2}
    />
  )
}

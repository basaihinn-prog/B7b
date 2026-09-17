import { WalletCards } from "lucide-react"
import { ModulePlaceholder } from "@/components/admin/module-placeholder"

export default function WalletsPage() {
  return (
    <ModulePlaceholder
      title="Wallets"
      description="Review balances, locked funds and wallet ownership."
      icon={WalletCards}
    />
  )
}

import { ArrowLeftRight } from "lucide-react"
import { ModulePlaceholder } from "@/components/admin/module-placeholder"

export default function TransactionsPage() {
  return (
    <ModulePlaceholder
      title="Transactions"
      description="Inspect immutable credit and debit ledger activity."
      icon={ArrowLeftRight}
    />
  )
}

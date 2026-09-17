import type { LucideIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function ModulePlaceholder({
  title,
  description,
  icon: Icon,
}: {
  title: string
  description: string
  icon: LucideIcon
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-5" />
            </div>

            <CardTitle>{title}</CardTitle>
          </div>

          <Badge variant="outline">UI Ready</Badge>
        </CardHeader>

        <CardContent>
          <div className="rounded-xl border border-dashed p-10 text-center">
            <p className="font-medium">
              {title} module shell is ready.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              API data, filters, actions and permissions will be connected
              in the next implementation phases.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  Boxes,
  CircleCheck,
  CircleX,
  Clock3,
  Gamepad2,
  Server,
  ShieldCheck,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getAdminDashboard } from "@/lib/server/admin-api"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  let data

  try {
    data = await getAdminDashboard()
  } catch (error) {
    console.error(
      "Unable to load admin dashboard:",
      error instanceof Error
        ? error.message
        : "UNKNOWN_ERROR"
    )

    return <DashboardError />
  }

  const overview = [
    {
      title: "Agents",
      value: String(data.users.agents_count),
      description: "Registered agent accounts",
      icon: Users,
    },
    {
      title: "Players",
      value: String(data.users.players_count),
      description: "Registered player accounts",
      icon: UserRound,
    },
    {
      title: "Active Sessions",
      value: String(data.gaming.active_sessions),
      description: "Currently active game sessions",
      icon: Activity,
    },
    {
      title: "Active Games",
      value: String(data.gaming.active_games),
      description: `${data.gaming.games_count} total games`,
      icon: Gamepad2,
    },
  ]

  const finance = [
    {
      title: "Wallet Balance",
      value: formatDecimal(data.wallets.total_balance),
      description: "Combined nominal wallet balance",
      icon: WalletCards,
    },
    {
      title: "Locked Balance",
      value: formatDecimal(data.wallets.locked_balance),
      description: "Combined nominal locked funds",
      icon: ShieldCheck,
    },
    {
      title: "Credit Volume",
      value: formatDecimal(
        data.transactions.credit_volume
      ),
      description: `${data.transactions.credit_count} credit transactions`,
      icon: ArrowDownLeft,
    },
    {
      title: "Debit Volume",
      value: formatDecimal(
        data.transactions.debit_volume
      ),
      description: `${data.transactions.debit_count} debit transactions`,
      icon: ArrowUpRight,
    },
  ]

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">
              Dashboard
            </h1>

            <Badge variant="outline">
              Live data
            </Badge>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Operational overview from the Ahmed Bet backend.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock3 className="size-4" />
          Generated {formatDate(data.generated_at)}
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeading
          title="Overview"
          description="Current platform activity and account counts."
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {overview.map((item) => (
            <MetricCard
              key={item.title}
              {...item}
            />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            title="Finance"
            description="Wallet and ledger activity from the current database."
          />

          <Badge
            variant="outline"
            className="w-fit"
          >
            All-currency aggregate
          </Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {finance.map((item) => (
            <MetricCard
              key={item.title}
              {...item}
            />
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          Financial totals currently aggregate all wallet currencies.
          Currency-by-currency accounting will replace this combined
          view before multi-currency operations are enabled.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Gaming Operations</CardTitle>
            <CardDescription>
              Provider, game and live-session availability.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <OperationCard
                icon={Boxes}
                title="Providers"
                primary={data.gaming.active_providers}
                secondary={data.gaming.providers_count}
              />

              <OperationCard
                icon={Gamepad2}
                title="Games"
                primary={data.gaming.active_games}
                secondary={data.gaming.games_count}
              />

              <OperationCard
                icon={Activity}
                title="Active Sessions"
                primary={data.gaming.active_sessions}
                secondary={data.gaming.active_sessions}
                secondaryLabel="current"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>
              Current backend service state.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <HealthRow
              icon={Server}
              label="API"
              status={data.system.api}
            />

            <HealthRow
              icon={Boxes}
              label="Database"
              status={data.system.database}
            />

            <div className="border-t pt-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">
                  Admin accounts
                </span>

                <span className="text-sm font-semibold">
                  {data.users.admins_count}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Latest wallet ledger activity.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {data.recent_transactions.length === 0 ? (
              <EmptyState
                icon={WalletCards}
                title="No transactions yet"
                description="Wallet activity will appear here."
              />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Direction</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">
                        Time
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {data.recent_transactions.map(
                      (transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {transaction.username ??
                                  `User #${transaction.user_id}`}
                              </p>

                              <p className="max-w-36 truncate text-xs text-muted-foreground">
                                {transaction.reference}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <Badge
                              variant={
                                transaction.direction ===
                                "credit"
                                  ? "default"
                                  : "outline"
                              }
                            >
                              {transaction.direction}
                            </Badge>
                          </TableCell>

                          <TableCell className="font-mono text-sm">
                            {transaction.currency
                              ? `${transaction.currency} `
                              : ""}
                            {formatDecimal(
                              transaction.amount
                            )}
                          </TableCell>

                          <TableCell>
                            {transaction.type}
                          </TableCell>

                          <TableCell className="whitespace-nowrap text-right text-xs text-muted-foreground">
                            {formatDate(
                              transaction.created_at
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Agents</CardTitle>
            <CardDescription>
              Most recently created agent accounts.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {data.recent_agents.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No agents yet"
                description="New agents will appear here."
              />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">
                        Created
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {data.recent_agents.map((agent) => (
                      <TableRow key={agent.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {agent.username}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {agent.email ?? "No email"}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant={
                              agent.status === "active"
                                ? "default"
                                : "outline"
                            }
                          >
                            {agent.status}
                          </Badge>
                        </TableCell>

                        <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                          {agent.last_login_at
                            ? formatDate(
                                agent.last_login_at
                              )
                            : "Never"}
                        </TableCell>

                        <TableCell className="whitespace-nowrap text-right text-xs text-muted-foreground">
                          {formatDate(agent.created_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string
  value: string
  description: string
  icon: typeof Users
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>

        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>

      <CardContent>
        <div className="break-all text-2xl font-bold">
          {value}
        </div>

        <p className="mt-1 text-xs text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

function SectionHeading({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold">
        {title}
      </h2>

      <p className="text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

function OperationCard({
  icon: Icon,
  title,
  primary,
  secondary,
  secondaryLabel = "total",
}: {
  icon: typeof Boxes
  title: string
  primary: number
  secondary: number
  secondaryLabel?: string
}) {
  return (
    <div className="rounded-xl border bg-muted/20 p-4">
      <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>

      <p className="text-sm font-medium">
        {title}
      </p>

      <div className="mt-2 flex items-end gap-2">
        <span className="text-2xl font-bold">
          {primary}
        </span>

        <span className="pb-1 text-xs text-muted-foreground">
          active
        </span>
      </div>

      <p className="mt-1 text-xs text-muted-foreground">
        {secondary} {secondaryLabel}
      </p>
    </div>
  )
}

function HealthRow({
  icon: Icon,
  label,
  status,
}: {
  icon: typeof Server
  label: string
  status: string
}) {
  const healthy = status === "online"

  return (
    <div className="flex items-center gap-3">
      <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">
          {label}
        </p>

        <p className="text-xs text-muted-foreground">
          Backend service
        </p>
      </div>

      <Badge
        variant={
          healthy ? "default" : "destructive"
        }
        className="gap-1"
      >
        {healthy ? (
          <CircleCheck className="size-3" />
        ) : (
          <CircleX className="size-3" />
        )}

        {status}
      </Badge>
    </div>
  )
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Users
  title: string
  description: string
}) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center">
      <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-5 text-muted-foreground" />
      </div>

      <p className="font-medium">
        {title}
      </p>

      <p className="mt-1 text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

function formatDecimal(value: string): string {
  if (!value) {
    return "0.0000"
  }

  const negative = value.startsWith("-")
  const unsigned = negative
    ? value.slice(1)
    : value

  const [whole, fraction] =
    unsigned.split(".")

  const grouped = (whole || "0").replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  )

  return `${negative ? "-" : ""}${grouped}${
    fraction !== undefined
      ? `.${fraction}`
      : ""
  }`
}

function formatDate(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "UTC",
    }
  ).format(date) + " UTC"
}

function DashboardError() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Dashboard
        </h1>

        <p className="text-sm text-muted-foreground">
          Ahmed Bet administration overview.
        </p>
      </div>

      <Card>
        <CardContent className="flex min-h-72 flex-col items-center justify-center text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <CircleX className="size-6" />
          </div>

          <h2 className="text-lg font-semibold">
            Dashboard data unavailable
          </h2>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            The administration panel could not retrieve
            dashboard data from the backend API.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

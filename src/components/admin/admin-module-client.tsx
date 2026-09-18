"use client"

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react"
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  SquareStop,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Kind =
  | "agents"
  | "players"
  | "wallets"
  | "transactions"
  | "providers"
  | "games"
  | "sessions"
  | "audit-logs"
  | "system"

type Field = {
  key: string
  label: string
  type?: "text" | "email" | "password" | "number"
  required?: boolean
  createOnly?: boolean
}

type Config = {
  title: string
  description: string
  endpoint: string
  columns: Array<[string, string]>
  createFields?: Field[]
  editableFields?: Field[]
}

const configs: Record<Exclude<Kind, "system">, Config> = {
  agents: {
    title: "Agents",
    description: "Create, search, edit, block and activate agent accounts.",
    endpoint: "agents",
    columns: [
      ["id", "ID"],
      ["username", "Username"],
      ["email", "Email"],
      ["parent_username", "Parent"],
      ["status", "Status"],
      ["last_login_at", "Last Login"],
      ["created_at", "Created"],
    ],
    createFields: [
      { key: "username", label: "Username", required: true },
      { key: "email", label: "Email", type: "email" },
      { key: "password", label: "Password", type: "password", required: true },
      { key: "parent_id", label: "Parent Admin ID", type: "number" },
      { key: "currency", label: "Currency", required: true },
    ],
    editableFields: [
      { key: "username", label: "Username" },
      { key: "email", label: "Email" },
      { key: "parent_id", label: "Parent Admin ID", type: "number" },
      { key: "password", label: "New Password", type: "password" },
    ],
  },
  players: {
    title: "Players",
    description: "Create, search, edit, block and activate player accounts.",
    endpoint: "players",
    columns: [
      ["id", "ID"],
      ["username", "Username"],
      ["email", "Email"],
      ["parent_username", "Parent"],
      ["status", "Status"],
      ["last_login_at", "Last Login"],
      ["created_at", "Created"],
    ],
    createFields: [
      { key: "username", label: "Username", required: true },
      { key: "email", label: "Email", type: "email" },
      { key: "password", label: "Password", type: "password", required: true },
      { key: "parent_id", label: "Parent Agent/Admin ID", type: "number" },
      { key: "currency", label: "Currency", required: true },
    ],
    editableFields: [
      { key: "username", label: "Username" },
      { key: "email", label: "Email" },
      { key: "parent_id", label: "Parent Agent/Admin ID", type: "number" },
      { key: "password", label: "New Password", type: "password" },
    ],
  },
  wallets: {
    title: "Wallets",
    description: "Review balances and perform audited credit/debit operations.",
    endpoint: "wallets",
    columns: [
      ["id", "Wallet"],
      ["username", "User"],
      ["role", "Role"],
      ["currency", "Currency"],
      ["balance", "Balance"],
      ["locked_balance", "Locked"],
      ["version", "Version"],
      ["updated_at", "Updated"],
    ],
  },
  transactions: {
    title: "Transactions",
    description: "Inspect the immutable wallet ledger.",
    endpoint: "transactions",
    columns: [
      ["id", "ID"],
      ["reference", "Reference"],
      ["username", "User"],
      ["currency", "Currency"],
      ["direction", "Direction"],
      ["type", "Type"],
      ["amount", "Amount"],
      ["balance_before", "Before"],
      ["balance_after", "After"],
      ["created_at", "Created"],
    ],
  },
  providers: {
    title: "Providers",
    description: "Create and manage game providers and availability.",
    endpoint: "providers",
    columns: [
      ["id", "ID"],
      ["code", "Code"],
      ["name", "Name"],
      ["base_url", "Base URL"],
      ["status", "Status"],
      ["updated_at", "Updated"],
    ],
    createFields: [
      { key: "code", label: "Code", required: true },
      { key: "name", label: "Name", required: true },
      { key: "base_url", label: "Base URL" },
      { key: "status", label: "Status" },
    ],
    editableFields: [
      { key: "code", label: "Code" },
      { key: "name", label: "Name" },
      { key: "base_url", label: "Base URL" },
    ],
  },
  games: {
    title: "Games",
    description: "Create and manage the game catalog and availability.",
    endpoint: "games",
    columns: [
      ["id", "ID"],
      ["provider_code", "Provider"],
      ["game_code", "Game Code"],
      ["game_name", "Game Name"],
      ["category", "Category"],
      ["status", "Status"],
      ["updated_at", "Updated"],
    ],
    createFields: [
      { key: "provider_id", label: "Provider ID", type: "number", required: true },
      { key: "game_code", label: "Game Code", required: true },
      { key: "game_name", label: "Game Name", required: true },
      { key: "category", label: "Category" },
      { key: "status", label: "Status" },
    ],
    editableFields: [
      { key: "provider_id", label: "Provider ID", type: "number" },
      { key: "game_code", label: "Game Code" },
      { key: "game_name", label: "Game Name" },
      { key: "category", label: "Category" },
    ],
  },
  sessions: {
    title: "Game Sessions",
    description: "Monitor active and historical game sessions and terminate active sessions.",
    endpoint: "sessions",
    columns: [
      ["id", "ID"],
      ["username", "User"],
      ["provider_code", "Provider"],
      ["game_name", "Game"],
      ["currency", "Currency"],
      ["status", "Status"],
      ["started_at", "Started"],
      ["ended_at", "Ended"],
    ],
  },
  "audit-logs": {
    title: "Audit Logs",
    description: "Review administrative and security-sensitive actions.",
    endpoint: "audit-logs",
    columns: [
      ["id", "ID"],
      ["actor_username", "Actor"],
      ["action", "Action"],
      ["entity_type", "Entity"],
      ["entity_id", "Entity ID"],
      ["ip_address", "IP"],
      ["created_at", "Created"],
    ],
  },
}

export function AdminModuleClient({ kind }: { kind: Kind }) {
  if (kind === "system") {
    return <SystemModule />
  }

  return <ListModule kind={kind} config={configs[kind]} />
}

function ListModule({
  kind,
  config,
}: {
  kind: Exclude<Kind, "system">
  config: Config
}) {
  const [items, setItems] = useState<Record<string, unknown>[]>([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [q, setQ] = useState("")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<Record<string, string>>(() => ({
    currency: "USD",
    status: "active",
  }))

  const url = useMemo(() => {
    const params = new URLSearchParams({
      page: String(page),
      per_page: "25",
    })
    if (q) params.set("q", q)
    return `/api/admin/${config.endpoint}?${params.toString()}`
  }, [config.endpoint, page, q])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(url, { cache: "no-store" })
      const payload = await response.json()

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error?.message ?? "Unable to load data.")
      }

      setItems(payload?.data?.items ?? [])
      setLastPage(payload?.data?.pagination?.last_page ?? 1)
      setTotal(payload?.data?.pagination?.total ?? 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load data.")
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    void load()
  }, [load])

  async function create(event: FormEvent) {
    event.preventDefault()
    if (!config.createFields) return

    setWorking(true)
    setError(null)

    try {
      const body: Record<string, unknown> = {}

      for (const field of config.createFields) {
        const value = form[field.key] ?? ""
        if (field.type === "number") {
          body[field.key] = value === "" ? null : Number(value)
        } else {
          body[field.key] = value
        }
      }

      const response = await fetch(`/api/admin/${config.endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const payload = await response.json()

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error?.message ?? "Create failed.")
      }

      setForm({ currency: "USD", status: "active" })
      setPage(1)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed.")
    } finally {
      setWorking(false)
    }
  }

  async function patchRow(
    row: Record<string, unknown>,
    patch: Record<string, unknown>
  ) {
    setWorking(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/admin/${config.endpoint}/${row.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        }
      )

      const payload = await response.json()

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error?.message ?? "Update failed.")
      }

      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.")
    } finally {
      setWorking(false)
    }
  }

  async function editRow(row: Record<string, unknown>) {
    if (!config.editableFields) return

    const patch: Record<string, unknown> = {}

    for (const field of config.editableFields) {
      const current =
        field.key === "password"
          ? ""
          : String(row[field.key] ?? "")

      const value = window.prompt(field.label, current)

      if (value === null) return

      if (field.key === "password" && value === "") {
        continue
      }

      patch[field.key] =
        field.type === "number"
          ? value === ""
            ? null
            : Number(value)
          : value
    }

    if (Object.keys(patch).length > 0) {
      await patchRow(row, patch)
    }
  }

  async function toggleStatus(row: Record<string, unknown>) {
    const current = String(row.status ?? "")
    const next =
      current === "active"
        ? kind === "agents" || kind === "players"
          ? "blocked"
          : "inactive"
        : "active"

    if (!window.confirm(`Change status ${current} → ${next}?`)) return

    await patchRow(row, { status: next })
  }

  async function walletAction(
    row: Record<string, unknown>,
    direction: "credit" | "debit"
  ) {
    const amount = window.prompt(
      `${direction === "credit" ? "Credit" : "Debit"} amount (${String(
        row.currency ?? ""
      )})`
    )

    if (!amount) return

    const reason = window.prompt(
      "Reason/type",
      `admin_${direction}`
    )

    if (reason === null) return

    if (!window.confirm(`${direction.toUpperCase()} ${amount}?`)) return

    setWorking(true)
    setError(null)

    try {
      const idempotency =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`

      const response = await fetch(
        `/api/admin/wallets/${row.id}/${direction}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount,
            type: reason || `admin_${direction}`,
            idempotency_key: `panel-${direction}-${idempotency}`,
          }),
        }
      )

      const payload = await response.json()

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error?.message ?? "Wallet operation failed.")
      }

      await load()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Wallet operation failed."
      )
    } finally {
      setWorking(false)
    }
  }

  async function terminate(row: Record<string, unknown>) {
    if (!window.confirm(`Terminate session #${String(row.id)}?`)) return

    setWorking(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/admin/sessions/${row.id}/terminate`,
        { method: "POST" }
      )

      const payload = await response.json()

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error?.message ?? "Terminate failed.")
      }

      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terminate failed.")
    } finally {
      setWorking(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{config.title}</h1>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </div>

        <div className="flex gap-2">
          <Badge variant="outline">{total} records</Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void load()}
            disabled={loading || working}
          >
            <RefreshCw className="size-4" />
            Refresh
          </Button>
        </div>
      </div>

      {error ? (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <ShieldAlert className="size-4" />
          {error}
        </div>
      ) : null}

      {config.createFields ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Plus className="size-4" />
              Create {config.title.replace(/s$/, "")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
              onSubmit={create}
            >
              {config.createFields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={`${kind}-${field.key}`}>{field.label}</Label>
                  <Input
                    id={`${kind}-${field.key}`}
                    type={field.type ?? "text"}
                    value={form[field.key] ?? ""}
                    required={field.required}
                    disabled={working}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        [field.key]: event.target.value,
                      }))
                    }
                  />
                </div>
              ))}

              <div className="flex items-end">
                <Button disabled={working} type="submit">
                  {working ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Plus className="size-4" />
                  )}
                  Create
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-base">{config.title} Data</CardTitle>

            <form
              className="flex w-full max-w-md gap-2"
              onSubmit={(event) => {
                event.preventDefault()
                setPage(1)
                setQ(search.trim())
              }}
            >
              <Input
                placeholder={`Search ${config.title.toLowerCase()}...`}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <Button variant="outline" type="submit">
                <Search className="size-4" />
              </Button>
            </form>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex min-h-48 items-center justify-center">
              <Loader2 className="size-6 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
              No records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {config.columns.map(([key, label]) => (
                      <TableHead key={key}>{label}</TableHead>
                    ))}
                    {hasActions(kind) ? (
                      <TableHead className="text-right">Actions</TableHead>
                    ) : null}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((row, index) => (
                    <TableRow key={String(row.id ?? index)}>
                      {config.columns.map(([key]) => (
                        <TableCell
                          key={key}
                          className={
                            key.includes("balance") || key === "amount"
                              ? "font-mono"
                              : ""
                          }
                        >
                          {formatValue(key, row[key])}
                        </TableCell>
                      ))}
                      {hasActions(kind) ? (
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            {config.editableFields ? (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={working}
                                onClick={() => void editRow(row)}
                              >
                                <Pencil className="size-3.5" />
                                Edit
                              </Button>
                            ) : null}

                            {["agents", "players", "providers", "games"].includes(
                              kind
                            ) ? (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={working}
                                onClick={() => void toggleStatus(row)}
                              >
                                {String(row.status) === "active"
                                  ? "Disable"
                                  : "Activate"}
                              </Button>
                            ) : null}

                            {kind === "wallets" ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={working}
                                  onClick={() => void walletAction(row, "credit")}
                                >
                                  <ArrowDownCircle className="size-3.5" />
                                  Credit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={working}
                                  onClick={() => void walletAction(row, "debit")}
                                >
                                  <ArrowUpCircle className="size-3.5" />
                                  Debit
                                </Button>
                              </>
                            ) : null}

                            {kind === "sessions" &&
                            String(row.status) === "active" ? (
                              <Button
                                size="sm"
                                variant="destructive"
                                disabled={working}
                                onClick={() => void terminate(row)}
                              >
                                <SquareStop className="size-3.5" />
                                Terminate
                              </Button>
                            ) : null}
                          </div>
                        </TableCell>
                      ) : null}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Page {page} of {lastPage}
            </span>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1 || loading}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= lastPage || loading}
                onClick={() =>
                  setPage((current) => Math.min(lastPage, current + 1))
                }
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function hasActions(kind: Exclude<Kind, "system">) {
  return [
    "agents",
    "players",
    "wallets",
    "providers",
    "games",
    "sessions",
  ].includes(kind)
}

function formatValue(key: string, value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "—"
  }

  if (key === "status" || key === "direction" || key === "role") {
    return <Badge variant="outline">{String(value)}</Badge>
  }

  if (
    key.endsWith("_at") &&
    typeof value === "string" &&
    !Number.isNaN(new Date(value).getTime())
  ) {
    return new Date(value).toLocaleString()
  }

  return String(value)
}

function SystemModule() {
  const [data, setData] = useState<Record<string, unknown> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/system", { cache: "no-store" })
      const payload = await response.json()

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error?.message ?? "Unable to load system state.")
      }

      setData(payload.data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load system state."
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System</h1>
          <p className="text-sm text-muted-foreground">
            Backend, database and control-plane health.
          </p>
        </div>

        <Button variant="outline" onClick={() => void load()}>
          <RefreshCw className="size-4" />
          Refresh
        </Button>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <Card>
        <CardContent className="p-6">
          {loading ? (
            <Loader2 className="size-6 animate-spin" />
          ) : (
            <pre className="overflow-x-auto whitespace-pre-wrap text-sm">
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
export type DashboardUserStats = {
  admins_count: number
  agents_count: number
  players_count: number
}

export type DashboardWalletStats = {
  total_balance: string
  locked_balance: string
}

export type DashboardGamingStats = {
  providers_count: number
  active_providers: number
  games_count: number
  active_games: number
  active_sessions: number
}

export type DashboardTransactionStats = {
  credit_count: number
  credit_volume: string
  debit_count: number
  debit_volume: string
}

export type RecentTransaction = {
  id: number
  reference: string
  user_id: number
  username: string | null
  currency: string | null
  direction: "credit" | "debit" | string
  type: string
  amount: string
  balance_before: string
  balance_after: string
  external_reference: string | null
  created_at: string
}

export type RecentAgent = {
  id: number
  username: string
  email: string | null
  status: string
  last_login_at: string | null
  created_at: string
}

export type AdminDashboardData = {
  users: DashboardUserStats
  wallets: DashboardWalletStats
  gaming: DashboardGamingStats
  transactions: DashboardTransactionStats
  recent_transactions: RecentTransaction[]
  recent_agents: RecentAgent[]
  system: {
    api: string
    database: string
  }
  generated_at: string
}

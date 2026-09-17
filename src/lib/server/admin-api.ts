import "server-only"

import { getAdminToken } from "@/lib/server/auth"
import type { AdminDashboardData } from "@/types/admin-dashboard"

function apiBase(): string {
  return (
    process.env.BACKEND_API_URL ??
    "https://api.mmcrt.com/api/v1"
  ).replace(/\/$/, "")
}

export async function getAdminDashboard(): Promise<AdminDashboardData> {
  const token = await getAdminToken()

  if (!token) {
    throw new Error("ADMIN_SESSION_MISSING")
  }

  const response = await fetch(
    `${apiBase()}/admin/dashboard`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  )

  const payload = await response.json().catch(() => null)

  if (
    !response.ok ||
    !payload?.success ||
    !payload?.data
  ) {
    throw new Error(
      payload?.error?.code ??
        `ADMIN_DASHBOARD_HTTP_${response.status}`
    )
  }

  return payload.data as AdminDashboardData
}

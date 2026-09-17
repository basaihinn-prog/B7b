import { cookies } from "next/headers"

export const ADMIN_COOKIE = "ahmed_admin_token"

export type AdminUser = {
  id: number
  username: string
  email: string | null
  role: string
  status: string
  last_login_at?: string | null
}

function apiBase(): string {
  return (
    process.env.BACKEND_API_URL ??
    "https://api.mmcrt.com/api/v1"
  ).replace(/\/$/, "")
}

export async function getAdminToken(): Promise<string | null> {
  const cookieStore = await cookies()

  return cookieStore.get(ADMIN_COOKIE)?.value ?? null
}

export async function validateAdminToken(
  token: string
): Promise<AdminUser | null> {
  try {
    const response = await fetch(`${apiBase()}/auth/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      return null
    }

    const payload = await response.json()

    const user = payload?.data?.user as AdminUser | undefined

    if (!payload?.success || !user) {
      return null
    }

    if (user.status !== "active") {
      return null
    }

    if (user.role !== "admin") {
      return null
    }

    return user
  } catch {
    return null
  }
}

export async function getAuthenticatedAdmin(): Promise<AdminUser | null> {
  const token = await getAdminToken()

  if (!token) {
    return null
  }

  return validateAdminToken(token)
}

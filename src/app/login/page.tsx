import { Suspense } from "react"
import {
  Database,
  Gamepad2,
  ServerCog,
  ShieldCheck,
} from "lucide-react"

import { LoginForm } from "@/components/auth/login-form"
import {
  Card,
  CardContent,
} from "@/components/ui/card"

export const metadata = {
  title: "Login",
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-4 md:p-8">
      <Card className="w-full max-w-5xl overflow-hidden p-0 shadow-xl">
        <CardContent className="grid min-h-[600px] p-0 md:grid-cols-2">
          <section className="flex flex-col justify-center p-8 md:p-12">
            <div className="mx-auto w-full max-w-sm">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                  <Gamepad2 className="size-6" />
                </div>

                <div>
                  <h1 className="text-xl font-bold">
                    Ahmed Bet
                  </h1>

                  <p className="text-sm text-muted-foreground">
                    Administration Platform
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  Sign in to access the administrative control panel.
                </p>
              </div>

              <Suspense
                fallback={
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    Loading sign in...
                  </div>
                }
              >
                <LoginForm />
              </Suspense>
            </div>
          </section>

          <section className="relative hidden overflow-hidden bg-slate-950 p-10 text-white md:flex md:flex-col md:justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 via-transparent to-cyan-500/20" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs">
                <ShieldCheck className="size-3.5" />
                Secure Administration
              </div>

              <h3 className="mt-8 max-w-md text-4xl font-bold leading-tight">
                Manage your gaming platform from one control center.
              </h3>

              <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
                Agents, players, wallets, providers, games, sessions,
                transactions and audit activity in one interface.
              </p>
            </div>

            <div className="relative grid gap-3">
              <Feature
                icon={ServerCog}
                title="API Control"
                description="Centralized backend operations"
              />

              <Feature
                icon={Database}
                title="Financial Ledger"
                description="Wallet and transaction visibility"
              />

              <Feature
                icon={Gamepad2}
                title="Gaming Operations"
                description="Providers, games and sessions"
              />
            </div>
          </section>
        </CardContent>
      </Card>
    </main>
  )
}

function Feature({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof ServerCog
  title: string
  description: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="flex size-9 items-center justify-center rounded-lg bg-white/10">
        <Icon className="size-4" />
      </div>

      <div>
        <p className="text-sm font-medium">
          {title}
        </p>

        <p className="text-xs text-slate-400">
          {description}
        </p>
      </div>
    </div>
  )
}

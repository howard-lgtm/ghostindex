import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AlertTriangle, TrendingDown, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import VerificationInstructions from "@/components/VerificationInstructions";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: reports } = await supabase
    .from("reports")
    .select(`
      *,
      companies (
        name,
        domain,
        ghost_index_score
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const { count: totalReports } = await supabase
    .from("reports")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: verifiedReports } = await supabase
    .from("reports")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_verified", true);

  return (
    <div className="min-h-screen bg-background" style={{minHeight: '100vh', height: 'auto'}}>
      <nav style={{borderBottom: '1px solid var(--border)'}}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Logo size={32} />
              <span className="text-2xl font-bold gradient-text">GhostIndex</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/search" className="text-base font-medium transition-colors" style={{color: 'var(--text)'}}>
                Search
              </Link>
              <Link href="/submit">
                <Button variant="action" size="sm">
                  Report Ghosting
                </Button>
              </Link>
              <ThemeToggle />
              <form action="/auth/signout" method="post">
                <Button variant="ghost" size="sm" type="submit">
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold" style={{color: 'var(--text)'}}>Dashboard</h1>
          <p className="mt-3 text-lg" style={{color: 'var(--text-dim)'}}>
            Welcome back, {user.email}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="rounded-xl bg-panel border border-border p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-text-dim">
                  Total Reports
                </p>
                <p className="mt-2 text-4xl font-bold text-primary">
                  {totalReports || 0}
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-action/10 brand-glow">
                <Users className="h-7 w-7 text-action" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-panel border border-border p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-text-dim">
                  Verified Reports
                </p>
                <p className="mt-2 text-4xl font-bold text-up">
                  {verifiedReports || 0}
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-up/10">
                <TrendingUp className="h-7 w-7 text-up" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-panel border border-border p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-medium text-text-dim">
                  Pending
                </p>
                <p className="mt-2 text-4xl font-bold text-primary">
                  {(totalReports || 0) - (verifiedReports || 0)}
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-warning/10">
                <TrendingDown className="h-7 w-7 text-warning" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <VerificationInstructions />
        </div>

        <div className="rounded-xl bg-panel border border-border shadow-lg">
          <div className="border-b border-border px-6 py-5">
            <h2 className="text-2xl font-semibold" style={{color: 'var(--text)'}}>Your Reports</h2>
          </div>
          <div className="p-6">
            {!reports || reports.length === 0 ? (
              <div className="text-center py-16">
                <div className="mx-auto h-16 w-16 flex items-center justify-center opacity-50">
                  <Logo size={64} />
                </div>
                <h3 className="mt-6 text-xl font-semibold" style={{color: 'var(--text)'}}>No reports yet</h3>
                <p className="mt-3 text-base" style={{color: 'var(--text-dim)'}}>
                  Start by reporting a company that ghosted you
                </p>
                <Link href="/submit" className="mt-6 inline-block">
                  <Button variant="action">Submit Your First Report</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report: any) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between rounded-lg p-4"
                    style={{border: '1px solid var(--border)'}}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold" style={{color: 'var(--text)'}}>
                          {report.companies?.name || "Unknown Company"}
                        </h3>
                        {report.is_verified && (
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" style={{background: 'var(--success-bg)', color: 'var(--success)'}}>
                            Verified
                          </span>
                        )}
                        <span
                          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                          style={{
                            background: report.status === "approved" ? 'var(--success-bg)' : report.status === "rejected" ? 'var(--danger-bg)' : 'var(--warning-bg)',
                            color: report.status === "approved" ? 'var(--success)' : report.status === "rejected" ? 'var(--danger)' : 'var(--warning)'
                          }}
                        >
                          {report.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm" style={{color: 'var(--text-dim)'}}>
                        {report.job_title || "No job title provided"}
                      </p>
                      <p className="mt-1 text-xs" style={{color: 'var(--text-faint)'}}>
                        Submitted {new Date(report.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {report.companies?.ghost_index_score !== null && (
                      <div className="ml-4 text-right">
                        <p className="text-sm font-medium" style={{color: 'var(--text-dim)'}}>
                          Ghost Score
                        </p>
                        <p className="text-2xl font-bold" style={{color: 'var(--warning)'}}>
                          {report.companies.ghost_index_score}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AlertTriangle, TrendingDown, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import VerificationInstructions from "@/components/VerificationInstructions";

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
    <div className="min-h-screen bg-background">
      <nav className="border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <AlertTriangle className="h-7 w-7 text-warning" />
              <span className="text-2xl font-bold gradient-text">GhostIndex</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/search" className="text-base font-medium text-foreground hover:text-action transition-colors">
                Search
              </Link>
              <Link href="/submit">
                <Button variant="action" size="sm">
                  Report Ghosting
                </Button>
              </Link>
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
          <h1 className="text-4xl font-bold text-primary">Dashboard</h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
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
            <h2 className="text-2xl font-semibold text-primary">Your Reports</h2>
          </div>
          <div className="p-6">
            {!reports || reports.length === 0 ? (
              <div className="text-center py-16">
                <AlertTriangle className="mx-auto h-16 w-16 text-text-dim" />
                <h3 className="mt-6 text-xl font-semibold text-primary">No reports yet</h3>
                <p className="mt-3 text-base text-text-dim">
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
                    className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 p-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-primary">
                          {report.companies?.name || "Unknown Company"}
                        </h3>
                        {report.is_verified && (
                          <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-400">
                            Verified
                          </span>
                        )}
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            report.status === "approved"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                              : report.status === "rejected"
                              ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
                              : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                          }`}
                        >
                          {report.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        {report.job_title || "No job title provided"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                        Submitted {new Date(report.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {report.companies?.ghost_index_score !== null && (
                      <div className="ml-4 text-right">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Ghost Score
                        </p>
                        <p className="text-2xl font-bold text-warning">
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

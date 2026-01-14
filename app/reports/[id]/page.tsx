import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Calendar, CheckCircle, Clock, User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import ActivityTimeline from "@/components/ActivityTimeline";
import Logo from "@/components/Logo";
import { getCompanyLogoUrl, getFaviconUrl } from "@/lib/utils/company-logo";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReportDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch report with company details
  const { data: report, error } = await supabase
    .from("reports")
    .select(`
      *,
      companies (
        id,
        name,
        domain,
        logo,
        ghost_index_score,
        stock_symbol,
        company_type,
        industry,
        employee_count_range
      )
    `)
    .eq("id", id)
    .single();

  if (error || !report) {
    notFound();
  }

  const company = report.companies;

  const getScoreColor = (score: number | null) => {
    if (score === null) return "var(--text-faint)";
    if (score >= 70) return "var(--down)";
    if (score >= 40) return "var(--warn)";
    return "var(--up)";
  };

  const getScoreLabel = (score: number | null) => {
    if (score === null) return "No Data";
    if (score >= 70) return "High Risk";
    if (score >= 40) return "Moderate";
    return "Low Risk";
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Navigation */}
      <nav className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Logo size={32} />
              <span className="text-2xl font-bold gradient-text">GhostIndex</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/search" className="text-base font-medium hover:text-action transition-colors" style={{ color: 'var(--text-dim)' }}>
                Search
              </Link>
              <Link href="/dashboard" className="text-base font-medium hover:text-action transition-colors" style={{ color: 'var(--text-dim)' }}>
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm mb-6 hover:text-action transition-colors" style={{ color: 'var(--text-dim)' }}>
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report header */}
            <div className="rounded-xl border p-6" style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={getCompanyLogoUrl(company.domain)}
                    alt={company.name}
                    className="h-16 w-16 object-contain rounded-lg"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = getFaviconUrl(company.domain, 64);
                    }}
                  />
                  <div>
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
                      {company.name}
                    </h1>
                    <p className="text-sm data-mono" style={{ color: 'var(--text-dim)' }}>
                      {company.domain}
                    </p>
                  </div>
                </div>
                
                {report.is_verified && (
                  <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
                    <CheckCircle className="h-4 w-4" />
                    Verified
                  </span>
                )}
              </div>

              {/* Job title */}
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-5 w-5" style={{ color: 'var(--text-dim)' }} />
                <span className="text-lg font-medium" style={{ color: 'var(--text)' }}>
                  {report.job_title || 'Position not specified'}
                </span>
              </div>

              {/* Report metadata */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" style={{ color: 'var(--text-dim)' }} />
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Reported</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                      {new Date(report.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" style={{ color: 'var(--text-dim)' }} />
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Status</p>
                    <p className="text-sm font-medium capitalize" style={{ color: 'var(--text)' }}>
                      {report.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="rounded-xl border p-6" style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}>
              <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>
                Report Timeline
              </h2>
              <ActivityTimeline 
                activities={[]}
                isVerified={report.is_verified}
                applicationDate={report.created_at}
                autoGhosted={report.auto_ghosted || false}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company score card */}
            <div className="rounded-xl border p-6" style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>
                Ghost Index Score
              </h3>
              
              <div className="text-center mb-4">
                <div className="text-5xl font-bold mb-2" style={{ color: getScoreColor(company.ghost_index_score) }}>
                  {company.ghost_index_score?.toFixed(1) || '—'}
                </div>
                <div className="text-sm font-medium" style={{ color: getScoreColor(company.ghost_index_score) }}>
                  {getScoreLabel(company.ghost_index_score)}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                {company.company_type && (
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: 'var(--text-dim)' }}>Type</span>
                    <span className="text-sm font-medium capitalize" style={{ color: 'var(--text)' }}>
                      {company.company_type}
                    </span>
                  </div>
                )}
                
                {company.industry && (
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: 'var(--text-dim)' }}>Industry</span>
                    <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                      {company.industry}
                    </span>
                  </div>
                )}
                
                {company.employee_count_range && (
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: 'var(--text-dim)' }}>Size</span>
                    <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                      {company.employee_count_range}
                    </span>
                  </div>
                )}
              </div>

              <Link href={`/search?q=${encodeURIComponent(company.name)}`} className="mt-6 block">
                <Button variant="outline" className="w-full">
                  View All Reports
                </Button>
              </Link>
            </div>

            {/* Info card */}
            <div className="rounded-xl border p-6" style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>
                About This Report
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-dim)' }}>
                This report has been {report.is_verified ? 'verified through email confirmation' : 'submitted and is pending verification'}.
              </p>
              
              {report.auto_ghosted && (
                <div className="rounded-lg p-3" style={{ background: 'var(--warning-bg)', border: '1px solid var(--warning)' }}>
                  <p className="text-xs font-medium" style={{ color: 'var(--text)' }}>
                    ⚠️ Auto-Ghosted
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>
                    No response received after 30 days
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

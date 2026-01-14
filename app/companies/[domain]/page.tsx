import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, TrendingDown, TrendingUp, Users, Calendar, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { getCompanyLogoUrl, getFaviconUrl } from "@/lib/utils/company-logo";

interface PageProps {
  params: Promise<{ domain: string }>;
}

export default async function CompanyDetailPage({ params }: PageProps) {
  const { domain } = await params;
  const supabase = await createClient();

  // Fetch company details
  const { data: company, error: companyError } = await supabase
    .from("companies")
    .select("*")
    .eq("domain", domain)
    .single();

  if (companyError || !company) {
    notFound();
  }

  // Fetch all reports for this company
  const { data: reports, error: reportsError } = await supabase
    .from("reports")
    .select("*")
    .eq("company_id", company.id)
    .order("created_at", { ascending: false });

  // Calculate report statistics
  const totalReports = reports?.length || 0;
  const verifiedReports = reports?.filter(r => r.is_verified).length || 0;
  const autoGhostedReports = reports?.filter(r => r.auto_ghosted).length || 0;

  const getScoreColor = (score: number | null) => {
    if (score === null) return "var(--text-faint)";
    if (score >= 70) return "var(--down)";
    if (score >= 40) return "var(--warn)";
    return "var(--up)";
  };

  const getScoreLabel = (score: number | null) => {
    if (score === null) return "No Data";
    if (score >= 70) return "High Risk";
    if (score >= 40) return "Moderate Risk";
    return "Low Risk";
  };

  const getScoreDescription = (score: number | null) => {
    if (score === null) return "Not enough data to calculate a Ghost Index Score.";
    if (score >= 70) return "This company has a high rate of ghosting candidates. Proceed with caution.";
    if (score >= 40) return "This company has a moderate ghosting rate. Be prepared for potential delays.";
    return "This company has a low ghosting rate and generally responds to candidates.";
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
        <Link href="/search" className="inline-flex items-center gap-2 text-sm mb-6 hover:text-action transition-colors" style={{ color: 'var(--text-dim)' }}>
          <ArrowLeft className="h-4 w-4" />
          Back to Search
        </Link>

        {/* Company Header */}
        <div className="rounded-xl border p-8 mb-8" style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}>
          <div className="flex items-start gap-6">
            <img
              src={getCompanyLogoUrl(company.domain)}
              alt={company.name}
              className="h-24 w-24 object-contain rounded-lg"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = getFaviconUrl(company.domain, 96);
              }}
            />
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text)' }}>
                {company.name}
              </h1>
              <p className="text-lg data-mono mb-4" style={{ color: 'var(--text-dim)' }}>
                {company.domain}
              </p>
              
              <div className="flex flex-wrap gap-3">
                {company.company_type && (
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium capitalize" style={{ background: 'var(--panel2)', color: 'var(--text)' }}>
                    {company.company_type}
                  </span>
                )}
                {company.industry && (
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium" style={{ background: 'var(--panel2)', color: 'var(--text)' }}>
                    {company.industry}
                  </span>
                )}
                {company.employee_count_range && (
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium" style={{ background: 'var(--panel2)', color: 'var(--text)' }}>
                    <Users className="h-3 w-3 mr-1" />
                    {company.employee_count_range}
                  </span>
                )}
                {company.stock_symbol && (
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium data-mono" style={{ background: 'var(--panel2)', color: 'var(--text)' }}>
                    {company.stock_symbol}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Ghost Index Score Card */}
            <div className="rounded-xl border p-8" style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text)' }}>
                Ghost Index Score
              </h2>
              
              <div className="flex items-center gap-8 mb-6">
                <div className="text-center">
                  <div className="text-7xl font-bold mb-2" style={{ color: getScoreColor(company.ghost_index_score) }}>
                    {company.ghost_index_score?.toFixed(1) || '—'}
                  </div>
                  <div className="text-xl font-semibold" style={{ color: getScoreColor(company.ghost_index_score) }}>
                    {getScoreLabel(company.ghost_index_score)}
                  </div>
                </div>
                
                <div className="flex-1">
                  <p className="text-base mb-4" style={{ color: 'var(--text-dim)' }}>
                    {getScoreDescription(company.ghost_index_score)}
                  </p>
                  
                  {company.ghost_index_score !== null && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span style={{ color: 'var(--text-dim)' }}>Score Range</span>
                        <span style={{ color: 'var(--text)' }}>0 (Best) - 100 (Worst)</span>
                      </div>
                      <div className="w-full h-2 rounded-full" style={{ background: 'var(--border)' }}>
                        <div 
                          className="h-2 rounded-full transition-all" 
                          style={{ 
                            width: `${company.ghost_index_score}%`,
                            background: getScoreColor(company.ghost_index_score)
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {company.description && (
                <div className="pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                  <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
                    {company.description}
                  </p>
                </div>
              )}
            </div>

            {/* Reports List */}
            <div className="rounded-xl border p-8" style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text)' }}>
                Reports ({totalReports})
              </h2>

              {reports && reports.length > 0 ? (
                <div className="space-y-4">
                  {reports.map((report: any) => (
                    <Link
                      key={report.id}
                      href={`/reports/${report.id}`}
                      className="block rounded-lg p-4 hover:bg-panel2 transition-colors"
                      style={{ border: '1px solid var(--border)' }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {report.is_verified && (
                              <CheckCircle className="h-4 w-4" style={{ color: 'var(--success)' }} />
                            )}
                            <span className="font-medium" style={{ color: 'var(--text)' }}>
                              {report.job_title || 'Position not specified'}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-dim)' }}>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(report.created_at).toLocaleDateString()}
                            </span>
                            
                            {report.is_verified && (
                              <span className="text-xs font-medium" style={{ color: 'var(--success)' }}>
                                Verified
                              </span>
                            )}
                            
                            {report.auto_ghosted && (
                              <span className="text-xs font-medium" style={{ color: 'var(--warning)' }}>
                                Auto-Ghosted
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <span className="text-sm capitalize px-3 py-1 rounded-full" style={{
                          background: report.status === 'approved' ? 'var(--success-bg)' : report.status === 'rejected' ? 'var(--danger-bg)' : 'var(--warning-bg)',
                          color: report.status === 'approved' ? 'var(--success)' : report.status === 'rejected' ? 'var(--danger)' : 'var(--warning)'
                        }}>
                          {report.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg mb-2" style={{ color: 'var(--text-dim)' }}>
                    No reports yet for this company
                  </p>
                  <p className="text-sm mb-6" style={{ color: 'var(--text-faint)' }}>
                    Be the first to share your experience
                  </p>
                  <Link href="/submit">
                    <Button variant="action">Submit a Report</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics Card */}
            <div className="rounded-xl border p-6" style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>
                Statistics
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: 'var(--text-dim)' }}>Total Reports</span>
                  <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>{totalReports}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: 'var(--text-dim)' }}>Verified Reports</span>
                  <span className="text-sm font-bold" style={{ color: 'var(--success)' }}>{verifiedReports}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: 'var(--text-dim)' }}>Auto-Ghosted</span>
                  <span className="text-sm font-bold" style={{ color: 'var(--warning)' }}>{autoGhostedReports}</span>
                </div>

                {company.headquarters && (
                  <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-xs mb-1" style={{ color: 'var(--text-dim)' }}>Headquarters</div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>{company.headquarters}</div>
                  </div>
                )}

                {company.founded_year && (
                  <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="text-xs mb-1" style={{ color: 'var(--text-dim)' }}>Founded</div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>{company.founded_year}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Card */}
            <div className="rounded-xl border p-6" style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>
                Share Your Experience
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-dim)' }}>
                Have you applied to {company.name}? Help others by sharing your experience.
              </p>
              <Link href="/submit">
                <Button variant="action" className="w-full">
                  Submit a Report
                </Button>
              </Link>
            </div>

            {/* Info Card */}
            <div className="rounded-xl border p-6" style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>
                About Ghost Index Scores
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-dim)' }}>
                Ghost Index Scores are calculated based on verified reports, response times, and ghosting incidents. 
                Higher scores indicate a higher likelihood of being ghosted by this company.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

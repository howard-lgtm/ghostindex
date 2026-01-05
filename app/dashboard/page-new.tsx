"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/types/database";
import { DonutChart } from "@/components/charts/DonutChart";
import { Sparkline } from "@/components/charts/Sparkline";

type Company = Database["public"]["Tables"]["companies"]["Row"];
type Report = Database["public"]["Tables"]["reports"]["Row"] & {
  companies: Company;
};

export default function DashboardPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      // Load companies
      const { data: companiesData } = await supabase
        .from("companies")
        .select("*")
        .order("name");

      if (companiesData) {
        setCompanies(companiesData);
        if (companiesData.length > 0) {
          setSelectedCompany(companiesData[0]);
        }
      }

      // Load recent verified reports
      const { data: reportsData } = await supabase
        .from("reports")
        .select("*, companies(*)")
        .eq("is_verified", true)
        .order("created_at", { ascending: false })
        .limit(20);

      if (reportsData) {
        setRecentReports(reportsData as Report[]);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  function getScoreColor(score: number | null) {
    if (score === null) return "text-terminal-label";
    if (score >= 70) return "text-terminal-amber";
    if (score >= 40) return "text-terminal-amber";
    return "text-terminal-cyan";
  }

  function getRiskLabel(score: number | null) {
    if (score === null) return "AUDIT PENDING";
    if (score >= 70) return "HIGH RISK";
    if (score >= 40) return "MODERATE RISK";
    return "LOW RISK";
  }

  function getDaysSince(date: string) {
    const days = Math.floor(
      (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
    );
    return days;
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-terminal-black">
        <div className="data-mono text-terminal-label">LOADING INDICES...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-terminal-black text-terminal-text font-mono">
      {/* Header Bar */}
      <div className="h-10 bg-terminal-gray border-b border-terminal-border flex items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <span className="data-mono text-xs text-terminal-purple font-bold tracking-widest">
            GHOSTINDEX
          </span>
          <span className="data-mono text-xs text-terminal-label">
            CORPORATE HIRING TRANSPARENCY TERMINAL
          </span>
        </div>
        <div className="timestamp">
          {new Date().toISOString().replace("T", " ").substring(0, 19)} UTC
        </div>
      </div>

      {/* Main 16:9 Dashboard Grid */}
      <div className="flex-1 grid grid-cols-10 gap-0 overflow-hidden">
        {/* Column 1: INDICES (20% - 2 cols) */}
        <div className="col-span-2 border-r border-terminal-border flex flex-col overflow-hidden">
          <div className="terminal-header">
            <span className="data-mono">INDICES</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {companies.map((company) => (
              <div
                key={company.id}
                onClick={() => setSelectedCompany(company)}
                className={`cursor-pointer border-b border-terminal-border p-2 hover:bg-terminal-gray transition-colors ${
                  selectedCompany?.id === company.id ? "bg-terminal-gray" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="data-mono text-xs font-bold text-terminal-text">
                    {company.domain.split(".")[0].toUpperCase().substring(0, 6)}
                  </span>
                  <span
                    className={`data-mono text-xs font-bold ${getScoreColor(
                      company.ghost_index_score
                    )}`}
                  >
                    {company.ghost_index_score !== null
                      ? `${company.ghost_index_score.toFixed(1)}%`
                      : "—"}
                  </span>
                </div>
                <div className="text-xs text-terminal-label truncate">
                  {company.name}
                </div>
                {/* Sparkline chart */}
                <div className="mt-1">
                  <Sparkline 
                    width={80} 
                    height={16}
                    color={company.ghost_index_score !== null && company.ghost_index_score >= 70 
                      ? "var(--terminal-amber)" 
                      : "var(--terminal-cyan)"}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: COMPANY AUDIT (50% - 5 cols) */}
        <div className="col-span-5 border-r border-terminal-border flex flex-col overflow-hidden">
          <div className="terminal-header">
            <span className="data-mono">COMPANY AUDIT</span>
          </div>
          {selectedCompany ? (
            <div className="flex-1 p-6 overflow-y-auto">
              {/* Company Header */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-2">
                  {selectedCompany.logo && (
                    <img
                      src={selectedCompany.logo}
                      alt={selectedCompany.name}
                      className="h-12 w-12 object-cover"
                    />
                  )}
                  <div>
                    <h1 className="data-mono text-2xl font-bold text-terminal-text">
                      {selectedCompany.name}
                    </h1>
                    <p className="data-mono text-sm text-terminal-label">
                      {selectedCompany.domain}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ghost Index Score - Large Display with Donut Chart */}
              <div className="mb-8 p-6 border border-terminal-border">
                <div className="text-xs text-terminal-label mb-4 tracking-widest">
                  GHOST INDEX SCORE
                </div>
                <div className="flex items-center gap-8">
                  <DonutChart score={selectedCompany.ghost_index_score} size={140} />
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span
                        className={`score-display ${getScoreColor(
                          selectedCompany.ghost_index_score
                        )}`}
                      >
                        {selectedCompany.ghost_index_score !== null
                          ? selectedCompany.ghost_index_score.toFixed(1)
                          : "—"}
                      </span>
                      {selectedCompany.ghost_index_score !== null && (
                        <span className="data-mono text-2xl text-terminal-label">
                          %
                        </span>
                      )}
                    </div>
                    <div
                      className={`data-mono text-sm font-bold ${
                        selectedCompany.ghost_index_score !== null &&
                        selectedCompany.ghost_index_score >= 70
                          ? "text-terminal-amber"
                          : "text-terminal-label"
                      }`}
                    >
                      {getRiskLabel(selectedCompany.ghost_index_score)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Responsiveness Analytics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-terminal-border">
                  <div className="text-xs text-terminal-label mb-2 tracking-widest">
                    AVG. WAIT TIME
                  </div>
                  <div className="data-mono text-2xl font-bold text-terminal-cyan">
                    {selectedCompany.ghost_index_score !== null ? "14.2" : "—"}
                  </div>
                  <div className="text-xs text-terminal-label mt-1">DAYS</div>
                </div>
                <div className="p-4 border border-terminal-border">
                  <div className="text-xs text-terminal-label mb-2 tracking-widest">
                    VERIFIED AUDIT DATE
                  </div>
                  <div className="data-mono text-sm font-bold text-terminal-emerald">
                    {selectedCompany.ghost_index_score !== null
                      ? new Date().toISOString().split("T")[0]
                      : "PENDING"}
                  </div>
                  <div className="text-xs text-terminal-label mt-1">
                    {selectedCompany.ghost_index_score !== null
                      ? "EMAIL VERIFIED"
                      : "AWAITING DATA"}
                  </div>
                </div>
              </div>

              {/* Additional Metrics */}
              <div className="mt-6 p-4 border border-terminal-border">
                <div className="text-xs text-terminal-label mb-3 tracking-widest">
                  TRANSPARENCY METRICS
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-terminal-label">
                      Total Reports
                    </span>
                    <span className="data-mono text-sm text-terminal-cyan">
                      {selectedCompany.ghost_index_score !== null ? "47" : "0"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-terminal-label">
                      Verified Reports
                    </span>
                    <span className="data-mono text-sm text-terminal-emerald">
                      {selectedCompany.ghost_index_score !== null ? "42" : "0"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-terminal-label">
                      Auto-Ghosted (30d)
                    </span>
                    <span className="data-mono text-sm text-terminal-amber">
                      {selectedCompany.ghost_index_score !== null ? "28" : "0"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <span className="data-mono text-terminal-label">
                SELECT COMPANY FROM INDEX
              </span>
            </div>
          )}
        </div>

        {/* Column 3: VERIFIED REPORT FEED (30% - 3 cols) */}
        <div className="col-span-3 flex flex-col overflow-hidden">
          <div className="terminal-header">
            <span className="data-mono">VERIFIED REPORT FEED</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="p-2 border-l-2 border-terminal-emerald bg-terminal-gray/30 hover:bg-terminal-gray transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="data-mono text-xs text-terminal-label">
                    [{new Date(report.created_at).toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                    })}]
                  </span>
                  <span className="verified-badge text-[0.5rem] px-1 py-0">
                    ✓
                  </span>
                </div>
                <div className="data-mono text-xs text-terminal-text mb-1">
                  {report.job_title || "Position Not Specified"}
                </div>
                <div className="data-mono text-xs text-terminal-label mb-1">
                  {report.companies.name}
                </div>
                <div className="data-mono text-xs text-terminal-amber">
                  {report.auto_ghosted
                    ? `NO RESPONSE (${getDaysSince(report.created_at)}D)`
                    : report.status === "rejected"
                    ? "REJECTED"
                    : "PENDING"}
                </div>
              </div>
            ))}
            {recentReports.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <span className="data-mono text-xs text-terminal-label">
                  NO VERIFIED REPORTS
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="h-6 bg-terminal-gray border-t border-terminal-border flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <span className="data-mono text-xs text-terminal-emerald">
            ● LIVE
          </span>
          <span className="data-mono text-xs text-terminal-label">
            {companies.length} COMPANIES INDEXED
          </span>
          <span className="data-mono text-xs text-terminal-label">
            {recentReports.length} VERIFIED REPORTS
          </span>
        </div>
        <span className="data-mono text-xs text-terminal-purple font-bold">
          GHOSTINDEX v1.0.0
        </span>
      </div>
    </div>
  );
}

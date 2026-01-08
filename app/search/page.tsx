"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, TrendingDown, TrendingUp } from "lucide-react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface Company {
  id: string;
  name: string;
  domain: string;
  logo: string | null;
  ghost_index_score: number | null;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const supabase = createClient();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .or(`name.ilike.%${query}%,domain.ilike.%${query}%`)
        .order("ghost_index_score", { ascending: false, nullsFirst: false })
        .limit(20);

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log("Search results:", data);
      setResults(data || []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-slate-400";
    if (score >= 70) return "text-red-600 dark:text-red-400";
    if (score >= 40) return "text-warning";
    return "text-green-600 dark:text-green-400";
  };

  const getScoreLabel = (score: number | null) => {
    if (score === null) return "No Data";
    if (score >= 70) return "High Risk";
    if (score >= 40) return "Moderate";
    return "Low Risk";
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Logo size={32} />
              <span className="text-xl font-bold text-primary">GhostIndex</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sm font-medium text-foreground hover:text-action">
                Dashboard
              </Link>
              <Link href="/submit">
                <Button variant="action" size="sm">
                  Report Ghosting
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-primary">Search Companies</h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
            Check ghost index scores before you apply
          </p>
        </div>

        <div className="mx-auto max-w-2xl mb-12">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by company name or domain..."
                className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-action focus:border-transparent bg-white dark:bg-slate-900 text-foreground"
              />
            </div>
            <Button type="submit" variant="action" size="lg" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </form>
        </div>

        {searched && (
          <div>
            {results.length === 0 ? (
              <div className="text-center py-12 terminal-panel">
                <Search className="mx-auto h-12 w-12 text-muted" />
                <h3 className="mt-4 text-sm font-medium text-foreground data-mono uppercase tracking-wide">NO RESULTS</h3>
                <p className="mt-2 text-muted text-xs data-mono">
                  Company not indexed. Submit first verified report.
                </p>
                <Link href="/submit" className="mt-6 inline-block">
                  <Button variant="action">SUBMIT REPORT</Button>
                </Link>
              </div>
            ) : (
              <div className="terminal-panel">
                <div className="terminal-header flex items-center justify-between">
                  <span className="data-mono">
                    RESULTS: {results.length} | VERIFIED DATA ONLY
                  </span>
                  <span className="timestamp">
                    {new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC
                  </span>
                </div>
                <table className="data-table w-full">
                  <thead>
                    <tr>
                      <th className="text-left">COMPANY</th>
                      <th className="text-left">DOMAIN</th>
                      <th className="text-right">INDEX</th>
                      <th className="text-right">RISK</th>
                      <th className="text-center">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((company) => (
                      <tr key={company.id}>
                        <td>
                          <div className="flex items-center gap-1.5">
                            {company.logo && (
                              <img
                                src={company.logo}
                                alt={company.name}
                                className="h-5 w-5 object-cover"
                              />
                            )}
                            <span className="text-white font-medium">{company.name}</span>
                          </div>
                        </td>
                        <td className="text-muted data-mono text-xs">
                          {company.domain}
                        </td>
                        <td className="text-right">
                          <span className={`data-mono text-lg font-bold ${
                            company.ghost_index_score === null
                              ? "text-muted"
                              : "data-value"
                          }`}>
                            {company.ghost_index_score !== null ? company.ghost_index_score.toFixed(1) : "—"}
                          </span>
                        </td>
                        <td className="text-right">
                          <span className={`data-mono text-xs font-bold ${
                            company.ghost_index_score === null
                              ? "text-muted"
                              : company.ghost_index_score >= 70
                              ? "risk-value"
                              : company.ghost_index_score >= 40
                              ? "risk-value"
                              : "data-value"
                          }`}>
                            {getScoreLabel(company.ghost_index_score)}
                          </span>
                        </td>
                        <td className="text-center">
                          {company.ghost_index_score !== null && (
                            <span className="verified-badge">
                              ✓ VERIFIED
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {!searched && (
          <div className="text-center py-12">
            <div className="mx-auto max-w-md">
              <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-8">
                <div className="mx-auto h-12 w-12 flex items-center justify-center">
                  <Logo size={48} />
                </div>
                <h3 className="mt-4 text-lg font-medium text-primary">
                  Understanding Ghost Index Scores
                </h3>
                <div className="mt-4 space-y-2 text-left text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span><strong>0-39:</strong> Low ghosting risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-warning"></div>
                    <span><strong>40-69:</strong> Moderate ghosting risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <span><strong>70-100:</strong> High ghosting risk</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

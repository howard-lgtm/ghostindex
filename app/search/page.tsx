"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, TrendingDown, TrendingUp } from "lucide-react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { getCompanyLogoUrl, getFaviconUrl } from "@/lib/utils/company-logo";
import { analytics } from "@/lib/analytics";

interface Company {
  id: string;
  name: string;
  domain: string;
  logo: string | null;
  ghost_index_score: number | null;
  stock_ticker: string | null;
  stock_exchange: string | null;
  is_public: boolean;
  company_type: 'public' | 'private' | 'startup' | 'nonprofit' | null;
  industry: string | null;
  employee_count_range: string | null;
  founded_year: number | null;
  headquarters: string | null;
  description: string | null;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Company[]>([]);
  const [suggestions, setSuggestions] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Live search with debouncing
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (query.trim().length >= 2) {
      debounceTimer.current = setTimeout(() => {
        fetchSuggestions(query);
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (searchQuery: string) => {
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=10`);
      
      if (response.status === 429) {
        setError('Too many searches. Please wait a moment.');
        setSuggestions([]);
        return;
      }
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const result = await response.json();
      setSuggestions(result.data || []);
      setShowSuggestions(true);
      setSelectedIndex(-1);
      setError(null);
    } catch (error) {
      console.error("Suggestion fetch error:", error);
      setSuggestions([]);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    setShowSuggestions(false);
    setError(null);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=50`);
      
      if (response.status === 429) {
        setError('Too many searches. Please wait a moment.');
        setResults([]);
        return;
      }
      
      if (!response.ok) {
        throw new Error('Search failed. Please try again.');
      }
      
      const result = await response.json();
      setResults(result.data || []);
      setError(null);
      
      analytics.trackSearch(query, result.data?.length || 0);
    } catch (error) {
      console.error("Search error:", error);
      setError('Search failed. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const selectCompany = (company: Company) => {
    setQuery(company.name);
    setShowSuggestions(false);
    setResults([company]);
    setSearched(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          selectCompany(suggestions[selectedIndex]);
        } else {
          handleSearch(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

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
    <div className="min-h-screen" style={{background: 'var(--bg)'}}>
      <nav className="border-b" style={{borderColor: 'var(--border)'}}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Logo size={32} />
              <span className="text-2xl font-bold gradient-text">GhostIndex</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-base font-medium hover:text-action transition-colors" style={{color: 'var(--text-dim)'}}>
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
          <h1 className="text-4xl font-bold" style={{color: 'var(--text)'}}>Search Companies</h1>
          <p className="mt-2 text-lg" style={{color: 'var(--text-dim)'}}>
            Check ghost index scores before you apply
          </p>
        </div>

        <div className="mx-auto max-w-2xl mb-12">
          {error && (
            <div className="mb-4 p-3 rounded-lg border" style={{background: 'var(--panel)', borderColor: 'var(--down)', color: 'var(--down)'}}>
              {error}
            </div>
          )}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2" style={{color: 'var(--text-dim)'}} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                placeholder="Search by company name or domain..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-action focus:border-transparent"
                style={{borderColor: 'var(--border)', background: 'var(--panel)', color: 'var(--text)'}}
                autoComplete="off"
              />
              
              {/* Live search suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div 
                  className="absolute z-50 w-full mt-2 border rounded-lg shadow-lg overflow-hidden"
                  style={{background: 'var(--panel)', borderColor: 'var(--border)'}}
                >
                  {suggestions.map((company, index) => (
                    <div
                      key={company.id}
                      onClick={() => selectCompany(company)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className="px-4 py-3 cursor-pointer transition-colors border-b last:border-b-0"
                      style={{
                        background: selectedIndex === index ? 'var(--bg)' : 'var(--panel)',
                        borderColor: 'var(--border)'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <img
                            src={getCompanyLogoUrl(company.domain)}
                            alt={company.name}
                            className="h-6 w-6 object-contain"
                            onError={(e) => {
                              const img = e.target as HTMLImageElement;
                              img.src = getFaviconUrl(company.domain, 32);
                            }}
                          />
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-medium" style={{color: 'var(--text)'}}>
                                {company.name}
                              </span>
                              {company.stock_ticker && (
                                <span className="data-mono text-xs font-semibold" style={{color: 'var(--action)'}}>
                                  ${company.stock_ticker}
                                </span>
                              )}
                            </div>
                            <span className="text-xs data-mono" style={{color: 'var(--text-dim)'}}>
                              {company.domain}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {company.industry && (
                            <span className="text-xs data-mono" style={{color: 'var(--text-dim)'}}>
                              {company.industry}
                            </span>
                          )}
                          {company.ghost_index_score !== null && (
                            <span 
                              className="data-mono text-sm font-bold"
                              style={{color: getScoreColor(company.ghost_index_score)}}
                            >
                              {company.ghost_index_score.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                      <th className="text-left">TYPE</th>
                      <th className="text-left">INDUSTRY</th>
                      <th className="text-right">SIZE</th>
                      <th className="text-right">INDEX</th>
                      <th className="text-right">RISK</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((company) => (
                      <tr key={company.id}>
                        <td>
                          <Link href={`/companies/${company.domain}`} className="block hover:opacity-80 transition-opacity">
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-1.5">
                                <img
                                  src={getCompanyLogoUrl(company.domain)}
                                  alt={company.name}
                                  className="h-5 w-5 object-contain"
                                  onError={(e) => {
                                    const img = e.target as HTMLImageElement;
                                    img.src = getFaviconUrl(company.domain, 32);
                                  }}
                                />
                                <span className="font-medium" style={{color: 'var(--text)'}}>{company.name}</span>
                                {company.stock_ticker && (
                                  <span className="data-mono text-xs font-semibold" style={{color: 'var(--action)'}}>${company.stock_ticker}</span>
                                )}
                              </div>
                              <span className="text-muted data-mono text-xs">{company.domain}</span>
                            </div>
                          </Link>
                        </td>
                        <td>
                          {company.company_type && (
                            <span className="data-mono text-xs uppercase" style={{color: company.company_type === 'public' ? 'var(--up)' : 'var(--text-dim)'}}>
                              {company.company_type}
                            </span>
                          )}
                        </td>
                        <td className="text-muted data-mono text-xs">
                          {company.industry || '—'}
                        </td>
                        <td className="text-right text-muted data-mono text-xs">
                          {company.employee_count_range || '—'}
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
                          <div className="flex flex-col items-end gap-0.5">
                            <span className="data-mono text-xs font-bold" style={{color: getScoreColor(company.ghost_index_score)}}>
                              {getScoreLabel(company.ghost_index_score)}
                            </span>
                            {company.ghost_index_score !== null && (
                              <span className="verified-badge text-xs">
                                ✓ VERIFIED
                              </span>
                            )}
                          </div>
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
              <div className="rounded-lg p-8 border" style={{background: 'var(--panel)', borderColor: 'var(--border)'}}>
                <div className="mx-auto h-12 w-12 flex items-center justify-center">
                  <Logo size={48} />
                </div>
                <h3 className="mt-4 text-lg font-medium" style={{color: 'var(--text)'}}>
                  Understanding Ghost Index Scores
                </h3>
                <div className="mt-4 space-y-2 text-left text-sm" style={{color: 'var(--text-dim)'}}>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{background: 'var(--up)'}}></div>
                    <span><strong>0-39:</strong> Low ghosting risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{background: 'var(--warn)'}}></div>
                    <span><strong>40-69:</strong> Moderate ghosting risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{background: 'var(--down)'}}></div>
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

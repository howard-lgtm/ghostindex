import Link from "next/link";
import { AlertTriangle, Search, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen" style={{background: 'var(--bg)'}}>
      <nav className="border-b" style={{borderColor: 'var(--border)'}}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5" style={{color: 'var(--warn)'}} />
              <span className="text-xl font-semibold" style={{color: 'var(--text)'}}>GhostIndex</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/search" className="text-sm" style={{color: 'var(--text-dim)'}}>
                Search Companies
              </Link>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="action" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block mb-6">
              <span className="text-xs uppercase tracking-widest" style={{color: 'var(--text-dim)'}}>CORPORATE HIRING TRANSPARENCY INDEX</span>
            </div>
            <h1 className="text-6xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
              <span style={{color: 'var(--mag)'}}>Ghost</span>
              <span style={{color: 'var(--text)'}}>Index</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base" style={{color: 'var(--text-dim)'}}>
              Data-driven transparency for the labor market
            </p>
            <div className="mt-10 flex items-center justify-center gap-3">
              <Link href="/search">
                <Button variant="action" size="lg">
                  <Search className="mr-2 h-4 w-4" />
                  SEARCH INDEX
                </Button>
              </Link>
              <Link href="/submit">
                <Button variant="outline" size="lg">
                  SUBMIT REPORT
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 border-t" style={{borderColor: 'var(--border)'}}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="panel">
              <div className="p-8">
                <div className="grid gap-8 md:grid-cols-3">
                  <div className="border-l-2 pl-4" style={{borderColor: 'var(--info)'}}>
                    <div className="flex items-center gap-2 mb-3">
                      <Search className="h-5 w-5" style={{color: 'var(--info)'}} />
                      <h3 className="text-sm font-semibold" style={{color: 'var(--text)'}}>
                        Search Index
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed" style={{color: 'var(--text-dim)'}}>
                      Query verified ghost index scores (0-100). Data sourced from email-verified reports only.
                    </p>
                  </div>
                  <div className="border-l-2 pl-4" style={{borderColor: 'var(--warn)'}}>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="h-5 w-5" style={{color: 'var(--warn)'}} />
                      <h3 className="text-sm font-semibold" style={{color: 'var(--text)'}}>
                        Submit Reports
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed" style={{color: 'var(--text-dim)'}}>
                      Forward application confirmation emails. Auto-flagged as ghosted after 30 days silence.
                    </p>
                  </div>
                  <div className="border-l-2 pl-4" style={{borderColor: 'var(--mag)'}}>
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="h-5 w-5" style={{color: 'var(--mag)'}} />
                      <h3 className="text-sm font-semibold" style={{color: 'var(--text)'}}>
                        Verified Data
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed" style={{color: 'var(--text-dim)'}}>
                      Email parsing ensures corporate domain verification. No subjective reviews.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 border-t" style={{borderColor: 'var(--border)'}}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="panel">
              <div className="p-12 text-center">
                <TrendingUp className="mx-auto h-12 w-12" style={{color: 'var(--info)'}} />
                <h2 className="mt-6 text-2xl font-bold" style={{color: 'var(--text)'}}>
                  Submit Verified Reports
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-sm" style={{color: 'var(--text-dim)'}}>
                  Create account to submit email-verified reports. Forward application confirmations to build transparency.
                </p>
                <div className="mt-8">
                  <Link href="/signup">
                    <Button variant="action" size="lg">
                      Create Account
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8" style={{borderColor: 'var(--border)'}}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" style={{color: 'var(--warn)'}} />
              <span className="font-semibold text-sm" style={{color: 'var(--mag)'}}>GhostIndex</span>
            </div>
            <div className="flex items-center gap-4 text-xs" style={{color: 'var(--text-faint)'}}>
              <Link href="/terms" className="hover:underline">Terms</Link>
              <Link href="/privacy" className="hover:underline">Privacy</Link>
              <Link href="/dmca" className="hover:underline">DMCA</Link>
              <span>© 2025 GhostIndex</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

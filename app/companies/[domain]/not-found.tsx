import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

export default function CompanyNotFound() {
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
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <Search className="mx-auto h-16 w-16 mb-6" style={{ color: 'var(--text-dim)' }} />
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text)' }}>
            Company Not Found
          </h1>
          <p className="text-lg mb-8" style={{ color: 'var(--text-dim)' }}>
            We don't have data for this company yet.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/search">
              <Button variant="action">Search Companies</Button>
            </Link>
            <Link href="/submit">
              <Button variant="outline">Submit a Report</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

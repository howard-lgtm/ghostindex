import Link from "next/link";
import { ArrowLeft, Target, Eye, Shield, Users } from "lucide-react";
import Logo from "@/components/Logo";

export const metadata = {
  title: "About - GhostIndex",
  description: "Learn about GhostIndex and our mission to bring transparency to hiring practices.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
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

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 hover:text-action transition-colors" style={{ color: 'var(--text-dim)' }}>
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-6 gradient-text">About GhostIndex</h1>

        <div className="prose prose-invert max-w-none space-y-8">
          <section className="rounded-xl border p-8" style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: 'var(--text)' }}>
              <Target className="h-6 w-6" style={{ color: 'var(--action)' }} />
              Our Mission
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-dim)' }}>
              GhostIndex exists to bring transparency to hiring practices. We believe job seekers deserve 
              to know which companies respect their time and which ones leave candidates in the dark. 
              By crowdsourcing data from real applicants, we're building the world's first accountability 
              index for employer communication.
            </p>
          </section>

          <section className="rounded-xl border p-8" style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: 'var(--text)' }}>
              <Eye className="h-6 w-6" style={{ color: 'var(--action)' }} />
              The Problem
            </h2>
            <p className="text-lg leading-relaxed mb-4" style={{ color: 'var(--text-dim)' }}>
              "Ghosting" in hiring has become an epidemic. Companies post jobs, collect applications, 
              conduct interviews—then vanish without a word. Candidates invest hours preparing, 
              researching, and interviewing, only to be met with silence.
            </p>
            <ul className="space-y-2" style={{ color: 'var(--text-dim)' }}>
              <li>• <strong style={{ color: 'var(--text)' }}>75%</strong> of job seekers report being ghosted after an interview</li>
              <li>• <strong style={{ color: 'var(--text)' }}>60%</strong> never receive any response to their applications</li>
              <li>• <strong style={{ color: 'var(--text)' }}>$0</strong> accountability for companies that waste candidates' time</li>
            </ul>
          </section>

          <section className="rounded-xl border p-8" style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: 'var(--text)' }}>
              <Shield className="h-6 w-6" style={{ color: 'var(--action)' }} />
              Our Solution
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-dim)' }}>
              The Ghost Index Score is a 0-100 rating that reflects how likely a company is to ghost 
              candidates. Lower scores mean better communication. We calculate this using verified 
              reports from real job seekers, weighted by recency, verification status, and interview stage.
            </p>
          </section>

          <section className="rounded-xl border p-8" style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: 'var(--text)' }}>
              <Users className="h-6 w-6" style={{ color: 'var(--action)' }} />
              Community-Powered
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-dim)' }}>
              GhostIndex is built by the community, for the community. Every report is verified through 
              email confirmation to ensure data quality. We don't sell your data—we use it to hold 
              employers accountable and help job seekers make informed decisions.
            </p>
          </section>

          <div className="text-center pt-8">
            <Link 
              href="/submit" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
              style={{ background: 'var(--action)', color: 'var(--bg)' }}
            >
              Report a Ghosting Experience
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

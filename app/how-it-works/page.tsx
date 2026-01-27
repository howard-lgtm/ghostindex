import Link from "next/link";
import { ArrowLeft, Search, FileText, CheckCircle, BarChart3 } from "lucide-react";
import Logo from "@/components/Logo";

export const metadata = {
  title: "How It Works - GhostIndex",
  description: "Learn how GhostIndex calculates Ghost Index Scores and how you can contribute.",
};

export default function HowItWorksPage() {
  const steps = [
    {
      icon: Search,
      title: "1. Search Companies",
      description: "Look up any company to see their Ghost Index Score before you apply. See how many reports they have and what candidates experienced.",
    },
    {
      icon: FileText,
      title: "2. Submit a Report",
      description: "Been ghosted? Submit a report with the company name, your application date, and what stage you reached. Your identity stays private.",
    },
    {
      icon: CheckCircle,
      title: "3. Verify via Email",
      description: "We send you a verification email to confirm your report is legitimate. This keeps our data accurate and trustworthy.",
    },
    {
      icon: BarChart3,
      title: "4. Score Updates",
      description: "Verified reports update the company's Ghost Index Score in real-time. More reports = more accurate scores.",
    },
  ];

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

        <h1 className="text-4xl font-bold mb-4 gradient-text">How It Works</h1>
        <p className="text-xl mb-12" style={{ color: 'var(--text-dim)' }}>
          GhostIndex uses crowdsourced, verified reports to calculate transparency scores for employers.
        </p>

        <div className="space-y-6 mb-12">
          {steps.map((step) => (
            <div 
              key={step.title}
              className="rounded-xl border p-6 flex gap-6 items-start"
              style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}
            >
              <div className="p-3 rounded-lg" style={{ background: 'var(--panel2)' }}>
                <step.icon className="h-6 w-6" style={{ color: 'var(--action)' }} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>{step.title}</h3>
                <p style={{ color: 'var(--text-dim)' }}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border p-8" style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text)' }}>
            Understanding the Ghost Index Score
          </h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold w-24" style={{ color: 'var(--up)' }}>0-39</span>
              <div>
                <span className="font-semibold" style={{ color: 'var(--up)' }}>Low Risk</span>
                <p className="text-sm" style={{ color: 'var(--text-dim)' }}>Company generally responds to candidates</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold w-24" style={{ color: 'var(--warn)' }}>40-69</span>
              <div>
                <span className="font-semibold" style={{ color: 'var(--warn)' }}>Moderate Risk</span>
                <p className="text-sm" style={{ color: 'var(--text-dim)' }}>Mixed feedback—some candidates ghosted</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold w-24" style={{ color: 'var(--down)' }}>70-100</span>
              <div>
                <span className="font-semibold" style={{ color: 'var(--down)' }}>High Risk</span>
                <p className="text-sm" style={{ color: 'var(--text-dim)' }}>Frequently ghosts candidates—proceed with caution</p>
              </div>
            </div>
          </div>

          <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
            Scores are calculated using verified reports, weighted by recency (newer reports count more), 
            interview stage reached, and whether the report was verified via email.
          </p>
        </div>

        <div className="flex gap-4 justify-center mt-12">
          <Link 
            href="/search" 
            className="px-6 py-3 rounded-lg font-semibold border transition-all hover:scale-105"
            style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            Search Companies
          </Link>
          <Link 
            href="/submit" 
            className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
            style={{ background: 'var(--action)', color: 'var(--bg)' }}
          >
            Submit a Report
          </Link>
        </div>
      </main>
    </div>
  );
}

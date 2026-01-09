import Link from "next/link";
import Logo from "@/components/Logo";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav style={{borderBottom: '1px solid var(--border)'}}>
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
        <h1 className="text-4xl font-bold mb-8" style={{color: 'var(--text)'}}>Terms of Service</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-sm mb-8" style={{color: 'var(--text-faint)'}}>
            Last Updated: January 4, 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>1. Acceptance of Terms</h2>
            <p style={{color: 'var(--text-dim)'}}>
              By accessing and using GhostIndex ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to these Terms of Service, please do not use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>2. User-Generated Content</h2>
            <p className="mb-4" style={{color: 'var(--text-dim)'}}>
              GhostIndex is a platform for users to share verified experiences with company hiring processes. By submitting a report, you agree that:
            </p>
            <ul className="list-disc pl-6 space-y-2" style={{color: 'var(--text-dim)'}}>
              <li>All information provided is truthful and accurate to the best of your knowledge</li>
              <li>You have evidence to support your claims (email confirmations, correspondence, etc.)</li>
              <li>You will not submit false, defamatory, or malicious content</li>
              <li>You grant GhostIndex a non-exclusive license to display and distribute your content</li>
              <li>Your content may be anonymized and aggregated for scoring purposes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>3. Email Verification</h2>
            <p style={{color: 'var(--text-dim)'}}>
              To verify reports, users may forward application confirmation emails to verify@getghostindex.com. By doing so, you:
            </p>
            <ul className="list-disc pl-6 space-y-2" style={{color: 'var(--text-dim)'}}>
              <li>Authorize GhostIndex to parse and store email metadata</li>
              <li>Confirm the email was legitimately received from the company domain</li>
              <li>Understand that email data will be used solely for verification purposes</li>
              <li>Agree that emails may be retained for up to 90 days for verification purposes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>4. Prohibited Conduct</h2>
            <p className="mb-4" style={{color: 'var(--text-dim)'}}>
              Users are prohibited from:
            </p>
            <ul className="list-disc pl-6 space-y-2" style={{color: 'var(--text-dim)'}}>
              <li>Submitting false or fabricated reports</li>
              <li>Creating multiple accounts to manipulate scores</li>
              <li>Harassing or defaming companies or individuals</li>
              <li>Attempting to circumvent verification systems</li>
              <li>Scraping or automated data collection without permission</li>
              <li>Using the Service for any illegal purpose</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>5. Content Moderation</h2>
            <p style={{color: 'var(--text-dim)'}}>
              GhostIndex reserves the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2" style={{color: 'var(--text-dim)'}}>
              <li>Review and remove content that violates these Terms</li>
              <li>Suspend or terminate accounts for repeat violations</li>
              <li>Respond to DMCA takedown notices and legal requests</li>
              <li>Update Ghost Index Scores based on verified data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>6. Disclaimer of Warranties</h2>
            <p style={{color: 'var(--text-dim)'}}>
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. GhostIndex does not guarantee:
            </p>
            <ul className="list-disc pl-6 space-y-2" style={{color: 'var(--text-dim)'}}>
              <li>The accuracy or completeness of user-submitted content</li>
              <li>That Ghost Index Scores reflect current company practices</li>
              <li>Uninterrupted or error-free service</li>
              <li>That the Service will meet your specific requirements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>7. Limitation of Liability</h2>
            <p style={{color: 'var(--text-dim)'}}>
              GhostIndex and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages 
              resulting from your use of the Service. This includes but is not limited to: employment decisions based on data, 
              reputational harm, or data breaches.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>8. Indemnification</h2>
            <p style={{color: 'var(--text-dim)'}}>
              You agree to indemnify and hold harmless GhostIndex from any claims, damages, or expenses arising from:
            </p>
            <ul className="list-disc pl-6 space-y-2" style={{color: 'var(--text-dim)'}}>
              <li>Your violation of these Terms</li>
              <li>Your submission of false or defamatory content</li>
              <li>Your violation of any third-party rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>9. DMCA Compliance</h2>
            <p className="mb-4" style={{color: 'var(--text-dim)'}}>
              GhostIndex complies with the Digital Millennium Copyright Act. If you believe content infringes your rights:
            </p>
            <ul className="list-disc pl-6 space-y-2" style={{color: 'var(--text-dim)'}}>
              <li>Send a notice to: dmca@getghostindex.com</li>
              <li>Include: URL, description of infringement, contact information</li>
              <li>We will respond within 48 hours</li>
              <li>Users may file counter-notices if content is removed</li>
            </ul>
            <p className="mt-4" style={{color: 'var(--text-dim)'}}>
              See our <Link href="/dmca" className="text-action hover:underline">DMCA Policy</Link> for full details.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>10. Changes to Terms</h2>
            <p style={{color: 'var(--text-dim)'}}>
              GhostIndex reserves the right to modify these Terms at any time. Continued use of the Service after changes 
              constitutes acceptance of the updated Terms. We will notify users of material changes via email or site notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>11. Governing Law</h2>
            <p style={{color: 'var(--text-dim)'}}>
              These Terms shall be governed by and construed in accordance with the laws of the United States, 
              without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>12. Contact</h2>
            <p style={{color: 'var(--text-dim)'}}>
              For questions about these Terms, contact us at: legal@getghostindex.com
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

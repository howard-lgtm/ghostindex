import Link from "next/link";
import Logo from "@/components/Logo";

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold mb-8" style={{color: 'var(--text)'}}>Privacy Policy</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-sm mb-8" style={{color: 'var(--text-faint)'}}>
            Last Updated: January 4, 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mb-3 mt-6" style={{color: 'var(--text)'}}>Account Information</h3>
            <p className="mb-4" style={{color: 'var(--text-dim)'}}>
              When you create an account, we collect:
            </p>
            <ul className="list-disc pl-6 space-y-2" style={{color: 'var(--text-dim)'}}>
              <li>Email address (for authentication and communication)</li>
              <li>Password (encrypted and never stored in plain text)</li>
              <li>Account creation date and last login timestamp</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{color: 'var(--text)'}}>Report Data</h3>
            <p className="mb-4" style={{color: 'var(--text-dim)'}}>
              When you submit a report, we collect:
            </p>
            <ul className="list-disc pl-6 space-y-2" style={{color: 'var(--text-dim)'}}>
              <li>Company name and domain</li>
              <li>Job title (optional)</li>
              <li>Application date and contact timeline</li>
              <li>Report status (pending, approved, rejected)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{color: 'var(--text)'}}>Email Verification Data</h3>
            <p className="mb-4" style={{color: 'var(--text-dim)'}}>
              When you forward emails to verify@getghostindex.com, we collect:
            </p>
            <ul className="list-disc pl-6 space-y-2" style={{color: 'var(--text-dim)'}}>
              <li>Email sender domain (to verify company)</li>
              <li>Email subject and body (to extract application details)</li>
              <li>Email timestamp (to track application timeline)</li>
              <li>Email metadata (headers, routing information)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>2. How We Use Your Information</h2>
            <p className="mb-4" style={{color: 'var(--text-dim)'}}>
              We use collected information to:
            </p>
            <ul className="list-disc pl-6 space-y-2" style={{color: 'var(--text-dim)'}}>
              <li>Verify the authenticity of reports via email confirmation</li>
              <li>Calculate Ghost Index Scores for companies</li>
              <li>Detect and flag applications ghosted after 30+ days</li>
              <li>Display anonymized, aggregated data to other users</li>
              <li>Prevent spam, fraud, and abuse of the platform</li>
              <li>Send service-related notifications (verification confirmations, score updates)</li>
              <li>Improve the Service and develop new features</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>3. Data Sharing and Disclosure</h2>
            
            <h3 className="text-xl font-semibold mb-3 mt-6" style={{color: 'var(--text)'}}>Public Data</h3>
            <p className="mb-4" style={{color: 'var(--text-dim)'}}>
              The following information is publicly visible:
            </p>
            <ul className="list-disc pl-6 space-y-2" style={{color: 'var(--text-dim)'}}>
              <li>Company names, domains, and Ghost Index Scores</li>
              <li>Aggregated report counts (total reports, verified reports)</li>
              <li>Anonymized report summaries (no personal identifiers)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{color: 'var(--text)'}}>Private Data</h3>
            <p className="mb-4" style={{color: 'var(--text-dim)'}}>
              The following information is never shared publicly:
            </p>
            <ul className="list-disc pl-6 space-y-2" style={{color: 'var(--text-dim)'}}>
              <li>Your email address or account credentials</li>
              <li>Individual report details linked to your identity</li>
              <li>Raw email content forwarded for verification</li>
              <li>Personal contact information</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{color: 'var(--text)'}}>Third-Party Services</h3>
            <p className="mb-4" style={{color: 'var(--text-dim)'}}>
              We use the following third-party services:
            </p>
            <ul className="list-disc pl-6 space-y-2" style={{color: 'var(--text-dim)'}}>
              <li><strong>Supabase:</strong> Database and authentication (GDPR compliant)</li>
              <li><strong>Mailgun/Postmark:</strong> Email parsing and delivery</li>
              <li><strong>Vercel:</strong> Hosting and deployment</li>
              <li><strong>Clearbit:</strong> Company logo retrieval (no personal data shared)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>4. Data Retention</h2>
            <p className="mb-4" style={{color: 'var(--text-dim)'}}>
              We retain data as follows:
            </p>
            <ul className="list-disc pl-6 space-y-2" style={{color: 'var(--text-dim)'}}>
              <li><strong>Account data:</strong> Until you delete your account</li>
              <li><strong>Reports:</strong> Indefinitely (for historical scoring accuracy)</li>
              <li><strong>Email verification data:</strong> 90 days after verification, then deleted</li>
              <li><strong>Aggregated scores:</strong> Indefinitely (anonymized, no personal data)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>5. Your Rights (GDPR Compliance)</h2>
            <p className="mb-4" style={{color: 'var(--text-dim)'}}>
              If you are in the EU/EEA, you have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2" style={{color: 'var(--text-dim)'}}>
              <li><strong>Access:</strong> Request a copy of all data we have about you</li>
              <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Erasure:</strong> Delete your account and associated data</li>
              <li><strong>Portability:</strong> Export your data in machine-readable format</li>
              <li><strong>Objection:</strong> Opt out of certain data processing activities</li>
              <li><strong>Restriction:</strong> Limit how we process your data</li>
            </ul>
            <p className="mt-4" style={{color: 'var(--text-dim)'}}>
              To exercise these rights, contact: privacy@getghostindex.com
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>6. California Privacy Rights (CCPA)</h2>
            <p className="mb-4" style={{color: 'var(--text-dim)'}}>
              California residents have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2" style={{color: 'var(--text-dim)'}}>
              <li>Know what personal information is collected and how it's used</li>
              <li>Request deletion of personal information</li>
              <li>Opt out of the sale of personal information (we do not sell data)</li>
              <li>Non-discrimination for exercising privacy rights</li>
            </ul>
            <p className="mt-4" style={{color: 'var(--text-dim)'}}>
              <Link href="/ccpa" className="text-action hover:underline">Do Not Sell My Personal Information</Link>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>7. Cookies and Tracking</h2>
            <p className="mb-4" style={{color: 'var(--text-dim)'}}>
              We use cookies for:
            </p>
            <ul className="list-disc pl-6 space-y-2" style={{color: 'var(--text-dim)'}}>
              <li><strong>Authentication:</strong> Keep you logged in (essential)</li>
              <li><strong>Preferences:</strong> Remember your settings (functional)</li>
              <li><strong>Analytics:</strong> Understand how users interact with the Service (optional)</li>
            </ul>
            <p className="mt-4" style={{color: 'var(--text-dim)'}}>
              You can disable non-essential cookies in your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>8. Data Security</h2>
            <p className="mb-4" style={{color: 'var(--text-dim)'}}>
              We implement security measures including:
            </p>
            <ul className="list-disc pl-6 space-y-2" style={{color: 'var(--text-dim)'}}>
              <li>Encryption in transit (HTTPS/TLS)</li>
              <li>Encryption at rest (database encryption)</li>
              <li>Row-level security policies (Supabase RLS)</li>
              <li>Webhook signature verification (prevent fake data)</li>
              <li>Regular security audits and updates</li>
            </ul>
            <p className="mt-4" style={{color: 'var(--text-dim)'}}>
              However, no system is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>9. Children's Privacy</h2>
            <p style={{color: 'var(--text-dim)'}}>
              GhostIndex is not intended for users under 18. We do not knowingly collect data from children. 
              If we discover a child's account, we will delete it immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>10. International Data Transfers</h2>
            <p style={{color: 'var(--text-dim)'}}>
              Your data may be transferred to and processed in the United States or other countries where our service providers operate. 
              We ensure appropriate safeguards are in place for international transfers (Standard Contractual Clauses, Privacy Shield, etc.).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>11. Changes to This Policy</h2>
            <p style={{color: 'var(--text-dim)'}}>
              We may update this Privacy Policy from time to time. We will notify you of material changes via email or a prominent notice on the Service. 
              Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>12. Contact Us</h2>
            <p className="mb-4" style={{color: 'var(--text-dim)'}}>
              For privacy-related questions or requests:
            </p>
            <ul className="list-none space-y-2" style={{color: 'var(--text-dim)'}}>
              <li><strong>Email:</strong> privacy@getghostindex.com</li>
              <li><strong>Data Protection Officer:</strong> dpo@getghostindex.com</li>
              <li><strong>GDPR Requests:</strong> gdpr@getghostindex.com</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}

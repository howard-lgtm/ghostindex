import Link from "next/link";
import Logo from "@/components/Logo";

export default function DMCAPage() {
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
        <h1 className="text-4xl font-bold mb-8" style={{color: 'var(--text)'}}>DMCA Takedown Policy</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-sm mb-8" style={{color: 'var(--text-faint)'}}>
            Last Updated: January 4, 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>Overview</h2>
            <p style={{color: 'var(--text-dim)'}}>
              GhostIndex respects the intellectual property rights of others and complies with the Digital Millennium Copyright Act (DMCA). 
              This policy outlines the process for reporting content that you believe infringes your rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>Designated DMCA Agent</h2>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
              <p className="text-slate-600 dark:text-slate-400 mb-2" style={{color: 'var(--text)'}}>
                <strong>Email:</strong> dmca@getghostindex.com
              </p>
              <p className="text-slate-600 dark:text-slate-400 mb-2" style={{color: 'var(--text)'}}>
                <strong>Response Time:</strong> Within 48 hours
              </p>
              <p style={{color: 'var(--text-dim)'}}>
                <strong>Registered with:</strong> U.S. Copyright Office
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>Filing a Takedown Notice</h2>
            <p className="mb-4" style={{color: 'var(--text-dim)'}}>
              If you believe content on GhostIndex infringes your rights, send a notice to dmca@getghostindex.com with:
            </p>
            <ul className="list-disc pl-6 space-y-2" style={{color: 'var(--text-dim)'}}>
              <li>Your contact information (name, address, email, phone)</li>
              <li>Identification of the copyrighted work claimed to be infringed</li>
              <li>URL or specific location of the infringing content</li>
              <li>A statement that you have a good faith belief the use is not authorized</li>
              <li>A statement that the information is accurate and you are authorized to act</li>
              <li>Your physical or electronic signature</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>Example Takedown Notice</h2>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700 font-mono text-sm">
              <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap" style={{color: 'var(--text)'}}>
{`To: dmca@getghostindex.com
Subject: DMCA Takedown Notice

I, [Your Name], representing [Company Name], hereby submit this DMCA takedown notice.

Copyrighted Work: [Description of your copyrighted material]

Infringing Content Location:
https://getghostindex.com/companies/example.com/report/123

Statement: I have a good faith belief that the use of the material described above is not authorized by the copyright owner, its agent, or the law.

Accuracy Statement: I swear, under penalty of perjury, that the information in this notification is accurate and that I am the copyright owner or authorized to act on behalf of the owner.

Signature: [Your Name]
Date: [Date]
Contact: [Email/Phone]`}
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>Our Response Process</h2>
            <p className="mb-4" style={{color: 'var(--text-dim)'}}>
              Upon receiving a valid DMCA notice, we will:
            </p>
            <ol className="list-decimal pl-6 text-slate-600 dark:text-slate-400 space-y-2" style={{color: 'var(--text)'}}>
              <li>Acknowledge receipt within 24 hours</li>
              <li>Review the notice for completeness and validity</li>
              <li>Remove or disable access to the allegedly infringing content</li>
              <li>Notify the user who posted the content</li>
              <li>Provide the user with a copy of the takedown notice</li>
              <li>Allow the user to file a counter-notice (see below)</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>Filing a Counter-Notice</h2>
            <p className="mb-4" style={{color: 'var(--text-dim)'}}>
              If your content was removed and you believe it was a mistake or misidentification, you may file a counter-notice with:
            </p>
            <ul className="list-disc pl-6 space-y-2" style={{color: 'var(--text-dim)'}}>
              <li>Your contact information (name, address, email, phone)</li>
              <li>Identification of the removed content and its prior location</li>
              <li>A statement under penalty of perjury that the content was removed by mistake</li>
              <li>Consent to jurisdiction of federal court in your district</li>
              <li>Your physical or electronic signature</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>Counter-Notice Process</h2>
            <p className="mb-4" style={{color: 'var(--text-dim)'}}>
              After receiving a valid counter-notice:
            </p>
            <ol className="list-decimal pl-6 text-slate-600 dark:text-slate-400 space-y-2" style={{color: 'var(--text)'}}>
              <li>We will forward the counter-notice to the original complainant</li>
              <li>The complainant has 10 business days to file a lawsuit</li>
              <li>If no lawsuit is filed, we will restore the content after 10-14 business days</li>
              <li>If a lawsuit is filed, the matter will be resolved in court</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>Repeat Infringer Policy</h2>
            <p style={{color: 'var(--text-dim)'}}>
              GhostIndex will terminate accounts of users who are repeat infringers. A user is considered a repeat infringer if:
            </p>
            <ul className="list-disc pl-6 space-y-2" style={{color: 'var(--text-dim)'}}>
              <li>They have received 3 or more valid DMCA takedown notices</li>
              <li>They have filed false or fraudulent counter-notices</li>
              <li>They have been found liable for infringement in court</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>Misrepresentation</h2>
            <p style={{color: 'var(--text-dim)'}}>
              Under Section 512(f) of the DMCA, anyone who knowingly materially misrepresents that content is infringing 
              may be liable for damages, including costs and attorney's fees. Do not file false takedown notices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>Section 230 Protection</h2>
            <p style={{color: 'var(--text-dim)'}}>
              GhostIndex is a platform for user-generated content. Under Section 230 of the Communications Decency Act, 
              we are not liable for content posted by users. We act as a neutral intermediary and respond to valid legal requests.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>Alternative Dispute Resolution</h2>
            <p className="mb-4" style={{color: 'var(--text-dim)'}}>
              Before filing a DMCA notice, consider:
            </p>
            <ul className="list-disc pl-6 space-y-2" style={{color: 'var(--text-dim)'}}>
              <li>Contacting the user directly to resolve the issue</li>
              <li>Verifying that the content actually infringes your rights</li>
              <li>Determining if the use qualifies as fair use</li>
              <li>Consulting with legal counsel</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text)'}}>Contact Information</h2>
            <p className="mb-4" style={{color: 'var(--text-dim)'}}>
              For DMCA-related inquiries:
            </p>
            <ul className="list-none space-y-2" style={{color: 'var(--text-dim)'}}>
              <li><strong>DMCA Agent:</strong> dmca@getghostindex.com</li>
              <li><strong>Legal Department:</strong> legal@getghostindex.com</li>
              <li><strong>General Support:</strong> support@getghostindex.com</li>
            </ul>
          </section>

          <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Note:</strong> This DMCA policy applies to copyright infringement claims. For other legal concerns 
              (defamation, privacy violations, etc.), please see our <Link href="/terms" className="underline">Terms of Service</Link> or 
              contact legal@getghostindex.com.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

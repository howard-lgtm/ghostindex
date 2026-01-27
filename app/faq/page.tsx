import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";

export const metadata = {
  title: "FAQ - GhostIndex",
  description: "Frequently asked questions about GhostIndex and how it works.",
};

const faqs = [
  {
    question: "What is ghosting in hiring?",
    answer: "Ghosting occurs when a company stops responding to a job candidate without explanation. This can happen at any stage—after applying, after a phone screen, or even after multiple rounds of interviews. The candidate is left without closure or feedback."
  },
  {
    question: "How is the Ghost Index Score calculated?",
    answer: "The score (0-100) is based on verified reports from real job seekers. We consider: number of ghosting reports, interview stage reached, recency of reports, and verification status. Lower scores indicate better communication practices."
  },
  {
    question: "Is my report anonymous?",
    answer: "Yes. We never share your identity with companies. Reports are aggregated into scores, and individual experiences are displayed without identifying information. Your email is only used for verification."
  },
  {
    question: "Why do I need to verify my email?",
    answer: "Email verification ensures data quality by confirming reports come from real people. This prevents spam, fake reports, and manipulation of scores. Verified reports carry more weight in our scoring algorithm."
  },
  {
    question: "Can companies remove or dispute their scores?",
    answer: "Companies cannot remove legitimate reports. However, if a company believes there's fraudulent data, they can contact us for review. We investigate all claims and may adjust scores if reports violate our guidelines."
  },
  {
    question: "What counts as ghosting?",
    answer: "We define ghosting as no response for 30+ days after: submitting an application you're qualified for, completing a phone screen, or having an interview. Simply not getting an interview doesn't count—companies receive many applications."
  },
  {
    question: "How can I improve my job search using GhostIndex?",
    answer: "Before applying, check a company's Ghost Index Score. Low scores (0-39) indicate responsive employers. High scores (70+) suggest you may want to apply elsewhere or set lower expectations. Use this data to prioritize your applications."
  },
  {
    question: "Is GhostIndex free?",
    answer: "Yes! Searching companies and submitting reports is completely free. We believe transparency in hiring should be accessible to everyone."
  },
  {
    question: "How do you make money?",
    answer: "We offer premium features for companies who want to improve their hiring reputation, including response analytics, badge certifications, and enhanced profiles. Job seekers always use GhostIndex for free."
  },
  {
    question: "Can I report positive experiences?",
    answer: "Currently, our focus is on tracking ghosting. However, companies with few or no reports naturally maintain low scores. We're exploring ways to highlight employers with exceptional communication in the future."
  },
];

export default function FAQPage() {
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

        <h1 className="text-4xl font-bold mb-4 gradient-text">Frequently Asked Questions</h1>
        <p className="text-xl mb-12" style={{ color: 'var(--text-dim)' }}>
          Everything you need to know about GhostIndex.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details 
              key={index}
              className="group rounded-xl border overflow-hidden"
              style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}
            >
              <summary 
                className="flex items-center justify-between p-6 cursor-pointer list-none font-semibold text-lg"
                style={{ color: 'var(--text)' }}
              >
                {faq.question}
                <span className="ml-4 transition-transform group-open:rotate-45" style={{ color: 'var(--action)' }}>+</span>
              </summary>
              <div className="px-6 pb-6">
                <p style={{ color: 'var(--text-dim)' }}>{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>

        <div className="mt-12 rounded-xl border p-8 text-center" style={{ background: 'var(--panel)', borderColor: 'var(--border)' }}>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>Still have questions?</h2>
          <p className="mb-4" style={{ color: 'var(--text-dim)' }}>We're here to help.</p>
          <a 
            href="mailto:support@getghostindex.com" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
            style={{ background: 'var(--action)', color: 'var(--bg)' }}
          >
            Contact Support
          </a>
        </div>
      </main>
    </div>
  );
}

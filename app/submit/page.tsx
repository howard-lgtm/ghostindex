"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function SubmitPage() {
  const [companyName, setCompanyName] = useState("");
  const [companyDomain, setCompanyDomain] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [applicationDate, setApplicationDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!user) {
      setError("You must be logged in to submit a report");
      setLoading(false);
      return;
    }

    try {
      let companyId: string;

      const { data: existingCompany } = await supabase
        .from("companies")
        .select("id")
        .eq("domain", companyDomain.toLowerCase())
        .single();

      if (existingCompany) {
        companyId = existingCompany.id;
      } else {
        const { data: newCompany, error: companyError } = await supabase
          .from("companies")
          .insert({
            name: companyName,
            domain: companyDomain.toLowerCase(),
            ghost_index_score: null,
          })
          .select()
          .single();

        if (companyError) throw companyError;
        companyId = newCompany.id;
      }

      const { data: newReport, error: reportError } = await supabase
        .from("reports")
        .insert({
          user_id: user.id,
          company_id: companyId,
          status: "pending",
          is_verified: false,
          job_title: jobTitle || null,
          application_date: applicationDate || null,
        })
        .select()
        .single();

      if (reportError) throw reportError;

      // Send verification email
      try {
        await fetch('/api/send-verification-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reportId: newReport.id,
            userEmail: user.email,
            userName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'there',
            companyName,
            jobTitle: jobTitle || 'a position',
            verificationCode: newReport.verification_code,
          }),
        });
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Don't fail the submission if email fails
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  const hashEmail = async (email: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(email);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <nav className="border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-warning" />
                <span className="text-xl font-bold text-primary">GhostIndex</span>
              </Link>
            </div>
          </div>
        </nav>

        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md text-center">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-8">
              <CheckCircle className="mx-auto h-16 w-16 text-green-600 dark:text-green-400" />
              <h2 className="mt-4 text-2xl font-bold text-green-900 dark:text-green-100">
                Report Published!
              </h2>
              <p className="mt-2 text-green-700 dark:text-green-300">
                Your report is now live on GhostIndex. Check your email for verification instructions.
              </p>
              <p className="mt-4 text-sm text-green-600 dark:text-green-400">
                Simply reply to the email with your application confirmation to verify your report.
              </p>
              <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                Redirecting to dashboard...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <nav className="border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-warning" />
                <span className="text-xl font-bold text-primary">GhostIndex</span>
              </Link>
            </div>
          </div>
        </nav>

        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md text-center">
            <AlertTriangle className="mx-auto h-16 w-16 text-warning" />
            <h2 className="mt-4 text-2xl font-bold text-primary">Sign In Required</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              You need to be signed in to submit a report
            </p>
            <div className="mt-6 flex gap-4 justify-center">
              <Link href="/login">
                <Button variant="action">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline">Create Account</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-warning" />
              <span className="text-xl font-bold text-primary">GhostIndex</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/search" className="text-sm font-medium text-foreground hover:text-action">
                Search
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary">Report Ghosting</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Help others by sharing your experience
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-primary mb-2">
                  Company Name *
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-action focus:border-transparent bg-white dark:bg-slate-900 text-foreground"
                  placeholder="e.g., Acme Corp"
                />
              </div>

              <div>
                <label htmlFor="companyDomain" className="block text-sm font-medium text-primary mb-2">
                  Company Domain *
                </label>
                <input
                  id="companyDomain"
                  type="text"
                  value={companyDomain}
                  onChange={(e) => setCompanyDomain(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-action focus:border-transparent bg-white dark:bg-slate-900 text-foreground"
                  placeholder="e.g., acme.com"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Enter the company's website domain
                </p>
              </div>

              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-primary mb-2">
                  Job Title (Optional)
                </label>
                <input
                  id="jobTitle"
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-action focus:border-transparent bg-white dark:bg-slate-900 text-foreground"
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              <div>
                <label htmlFor="applicationDate" className="block text-sm font-medium text-primary mb-2">
                  Application Date (Optional)
                </label>
                <input
                  id="applicationDate"
                  type="date"
                  value={applicationDate}
                  onChange={(e) => setApplicationDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-action focus:border-transparent bg-white dark:bg-slate-900 text-foreground"
                />
                <p className="mt-1 text-xs text-slate-500">
                  When did you apply? Helps with auto-ghost detection after 30 days.
                </p>
              </div>

              <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
                <p className="text-sm text-indigo-900 dark:text-indigo-100 font-medium mb-2">
                  ✅ Your report will be published immediately!
                </p>
                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                  We'll send you a verification email. Simply reply with your application confirmation to verify your report and enable auto-ghost detection.
                </p>
              </div>

              <Button
                type="submit"
                variant="action"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Report"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Mail, CheckCircle, Clock } from "lucide-react";

export default function VerificationInstructions() {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-action/10">
            <Mail className="h-6 w-6 text-action" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-primary mb-2">
            Verify Your Reports
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Forward your application confirmation emails to verify your reports and enable auto-ghost detection.
          </p>
          
          <div className="rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                VERIFICATION EMAIL ADDRESS
              </span>
            </div>
            <div className="flex items-center gap-2">
              <code className="text-lg font-mono font-semibold text-action">
                verify@getghostindex.com
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('verify@getghostindex.com');
                }}
                className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold">
                  1
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-primary">
                  Find your application confirmation email
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Look for emails from company recruiters confirming they received your application
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold">
                  2
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-primary">
                  Forward to verify@getghostindex.com
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  We'll automatically parse the email and link it to your report
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold">
                  3
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-primary">
                  Auto-ghost detection enabled
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  If no response in 30 days, we'll automatically flag it as ghosted
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3">
            <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-200">
              <strong>Note:</strong> Only forward emails from company domains (not Gmail, Yahoo, etc.). 
              We verify the sender to prevent fake reports.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

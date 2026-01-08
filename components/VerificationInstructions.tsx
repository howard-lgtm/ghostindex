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
            Check your email for verification instructions. Simply click the verification link to verify your reports.
          </p>
          
          <div className="rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 p-4 mb-4">
            <p className="text-sm text-indigo-900 dark:text-indigo-100 font-medium mb-1">
              ✅ Reports are published instantly!
            </p>
            <p className="text-xs text-indigo-700 dark:text-indigo-300">
              We send you a verification email after each submission. Just click to verify.
            </p>
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
                  Submit your report
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Your report goes live immediately - no waiting!
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
                  Check your email
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  We'll send you a verification email with a unique reply address
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
                  Click to verify
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Click the verification button in the email - done!
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-green-800 dark:text-green-200">
              <strong>Why verify?</strong> Verified reports carry more weight in Ghost Index Scores and enable automatic ghosting detection after 30 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

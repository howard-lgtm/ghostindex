"use client";

import { Mail, CheckCircle, Clock } from "lucide-react";

export default function VerificationInstructions() {
  return (
    <div className="rounded-lg p-6" style={{border: '1px solid var(--border)', background: 'var(--panel)'}}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-action/10">
            <Mail className="h-6 w-6 text-action" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2" style={{color: 'var(--text)'}}>
            Verify Your Reports
          </h3>
          <p className="text-sm mb-4" style={{color: 'var(--text-dim)'}}>
            Check your email for verification instructions. Simply click the verification link to verify your reports.
          </p>
          
          <div className="rounded-lg p-4 mb-4" style={{background: 'var(--info-bg)', border: '1px solid var(--info)'}}>
            <p className="text-sm font-medium mb-1" style={{color: 'var(--text)'}}>
              ✅ Reports are published instantly!
            </p>
            <p className="text-xs" style={{color: 'var(--text-dim)'}}>
              We send you a verification email after each submission. Just click to verify.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold" style={{background: 'var(--success-bg)', color: 'var(--success)'}}>
                  1
                </div>
              </div>
              <div>
                <p className="text-sm font-medium" style={{color: 'var(--text)'}}>
                  Submit your report
                </p>
                <p className="text-xs mt-1" style={{color: 'var(--text-dim)'}}>
                  Your report goes live immediately - no waiting!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold" style={{background: 'var(--success-bg)', color: 'var(--success)'}}>
                  2
                </div>
              </div>
              <div>
                <p className="text-sm font-medium" style={{color: 'var(--text)'}}>
                  Check your email
                </p>
                <p className="text-xs mt-1" style={{color: 'var(--text-dim)'}}>
                  We'll send you a verification email with a unique reply address
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold" style={{background: 'var(--success-bg)', color: 'var(--success)'}}>
                  3
                </div>
              </div>
              <div>
                <p className="text-sm font-medium" style={{color: 'var(--text)'}}>
                  Click to verify
                </p>
                <p className="text-xs mt-1" style={{color: 'var(--text-dim)'}}>
                  Click the verification button in the email - done!
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-lg p-3" style={{background: 'var(--success-bg)', border: '1px solid var(--success)'}}>
            <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" style={{color: 'var(--success)'}} />
            <p className="text-xs" style={{color: 'var(--text)'}}>
              <strong>Why verify?</strong> Verified reports carry more weight in Ghost Index Scores and enable automatic ghosting detection after 30 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "./ui/button";

interface ResendVerificationButtonProps {
  reportId: string;
  companyName: string;
}

export default function ResendVerificationButton({ reportId, companyName }: { reportId: string; companyName: string }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResend = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }
      
      // Show success message
      alert('Verification email sent! Check your inbox.');
    } catch (error) {
      console.error('Resend error:', error);
      alert('Failed to send verification email. Please try again.');
    }
  };

  return (
    <button
      onClick={handleResend}
      disabled={loading}
      className="text-sm text-action hover:text-action-hover transition-colors disabled:opacity-50"
    >
      {loading ? 'Sending...' : 'Resend Verification Email'}
    </button>
  );
}

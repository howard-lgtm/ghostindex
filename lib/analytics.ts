/**
 * Analytics tracking utilities
 * Uses Plausible Analytics for privacy-friendly tracking
 */

declare global {
  interface Window {
    plausible?: (event: string, options?: { props: Record<string, string | number | boolean> }) => void;
  }
}

export const trackEvent = (
  eventName: string,
  props?: Record<string, string | number | boolean>
) => {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(eventName, props ? { props } : undefined);
  }
};

export const analytics = {
  trackSearch: (query: string, resultsCount: number) => {
    trackEvent('Search', {
      query: query.substring(0, 50),
      results: resultsCount,
    });
  },

  trackCompanyView: (companyDomain: string) => {
    trackEvent('Company View', {
      domain: companyDomain,
    });
  },

  trackReportSubmit: (companyDomain: string) => {
    trackEvent('Report Submit', {
      domain: companyDomain,
    });
  },

  trackReportVerify: (reportId: string) => {
    trackEvent('Report Verify', {
      reportId,
    });
  },

  trackSignup: (method: 'email' | 'oauth') => {
    trackEvent('Signup', {
      method,
    });
  },

  trackLogin: (method: 'email' | 'oauth') => {
    trackEvent('Login', {
      method,
    });
  },

  trackResendVerification: () => {
    trackEvent('Resend Verification');
  },

  trackEmailVerificationClick: () => {
    trackEvent('Email Verification Click');
  },
};

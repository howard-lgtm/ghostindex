/**
 * Analytics tracking utilities
 * Supports multiple analytics providers: Vercel Analytics and Umami
 */

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, string | number | boolean>) => void;
    };
    va?: (event: string, data?: Record<string, string | number | boolean>) => void;
  }
}

export const trackEvent = (
  eventName: string,
  props?: Record<string, string | number | boolean>
) => {
  if (typeof window === 'undefined') return;

  // Track with Vercel Analytics
  if (window.va) {
    window.va(eventName, props);
  }

  // Track with Umami
  if (window.umami) {
    window.umami.track(eventName, props);
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

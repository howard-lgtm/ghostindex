'use client';

import { useEffect } from 'react';
import { analytics } from '@/lib/analytics';

interface CompanyPageTrackerProps {
  domain: string;
}

export default function CompanyPageTracker({ domain }: CompanyPageTrackerProps) {
  useEffect(() => {
    analytics.trackCompanyView(domain);
  }, [domain]);

  return null;
}

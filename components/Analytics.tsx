'use client';

import Script from 'next/script';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';

export default function Analytics() {
  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL || 'https://ghostindex-analytics.vercel.app';
  
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <>
      {/* Vercel Analytics - Free tier */}
      <VercelAnalytics />
      
      {/* Umami Analytics - Self-hosted */}
      {umamiWebsiteId && (
        <Script
          src={`${umamiUrl}/script.js`}
          data-website-id={umamiWebsiteId}
          strategy="afterInteractive"
        />
      )}
    </>
  );
}

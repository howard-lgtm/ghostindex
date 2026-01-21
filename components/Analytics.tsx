'use client';

import Script from 'next/script';

export default function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || 'getghostindex.com';
  
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <Script
      data-domain={domain}
      src="https://plausible.io/js/script.js"
      strategy="beforeInteractive"
    />
  );
}

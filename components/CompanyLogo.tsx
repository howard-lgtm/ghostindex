'use client';

import { useState } from 'react';
import { getCompanyLogoUrl, getFaviconUrl } from '@/lib/utils/company-logo';

interface CompanyLogoProps {
  domain: string;
  name: string;
  size?: number;
  className?: string;
}

export default function CompanyLogo({ domain, name, size = 96, className = '' }: CompanyLogoProps) {
  const [imgSrc, setImgSrc] = useState(getCompanyLogoUrl(domain));
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(getFaviconUrl(domain, size));
    }
  };

  return (
    <img
      src={imgSrc}
      alt={name}
      className={className}
      onError={handleError}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  );
}

/**
 * Get company logo URL using Clearbit Logo API
 * Falls back to Google favicon if Clearbit fails
 */
export function getCompanyLogoUrl(domain: string): string {
  if (!domain) return '';
  
  // Remove protocol and www if present
  const cleanDomain = domain
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0];
  
  return `https://logo.clearbit.com/${cleanDomain}`;
}

/**
 * Get fallback favicon URL
 */
export function getFaviconUrl(domain: string, size: number = 128): string {
  if (!domain) return '';
  
  const cleanDomain = domain
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0];
  
  return `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=${size}`;
}

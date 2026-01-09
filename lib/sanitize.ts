import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize user input by stripping all HTML tags
 * Use for text inputs like company names, domains, job titles
 */
export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [], // Strip all HTML
    ALLOWED_ATTR: []
  });
}

/**
 * Sanitize HTML content while allowing safe tags
 * Use for rich text content like descriptions
 */
export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  });
}

/**
 * Validate and sanitize domain names
 */
export function sanitizeDomain(domain: string): string {
  // Remove protocol and www
  let cleaned = domain
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0];
  
  // Strip any HTML
  cleaned = sanitizeInput(cleaned);
  
  // Basic domain validation
  const domainRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/;
  if (!domainRegex.test(cleaned)) {
    throw new Error('Invalid domain format');
  }
  
  return cleaned;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

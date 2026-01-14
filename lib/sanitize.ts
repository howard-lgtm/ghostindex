/**
 * Sanitize user input by stripping all HTML tags and dangerous characters
 * Use for text inputs like company names, domains, job titles
 */
export function sanitizeInput(input: string): string {
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Remove potentially dangerous characters
  sanitized = sanitized.replace(/[<>'"]/g, '');
  
  // Trim whitespace
  return sanitized.trim();
}

/**
 * Sanitize HTML content while allowing safe tags
 * Use for rich text content like descriptions
 */
export function sanitizeHTML(html: string): string {
  // For now, just strip all HTML - can enhance later if needed
  return sanitizeInput(html);
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

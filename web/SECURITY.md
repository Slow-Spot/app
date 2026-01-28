# Security Configuration

This document explains the security headers configured for the Slow Spot web application.

## Security Headers (vercel.json)

### X-Content-Type-Options: nosniff
Prevents browsers from MIME-sniffing a response away from the declared content-type. This prevents attacks based on MIME confusion.

### X-Frame-Options: DENY
Prevents the site from being embedded in iframes, protecting against clickjacking attacks.

### Referrer-Policy: strict-origin-when-cross-origin
Controls how much referrer information is sent with requests. This balances privacy with functionality.

### Permissions-Policy
Restricts browser features:
- `camera=()` - Disables camera access
- `microphone=()` - Disables microphone access
- `geolocation=()` - Disables geolocation
- `interest-cohort=()` - Opts out of Google FLoC tracking

### Strict-Transport-Security
Forces browsers to use HTTPS for all requests to the site for 2 years, including subdomains.

### Content-Security-Policy
Restricts resource loading to prevent XSS attacks:

**Note on `unsafe-inline` and `unsafe-eval`:**
- These directives are required for Next.js's client-side hydration and runtime
- Google Analytics also requires inline scripts
- Future improvement: Implement nonce-based CSP for better security without breaking Next.js functionality

## Deprecated Headers

### X-XSS-Protection (Removed)
This header was previously included but has been removed because:
- It's deprecated in modern browsers
- Can introduce security vulnerabilities in older browsers
- Modern browsers rely on Content-Security-Policy instead
- Not recommended by current security best practices

<?php
declare(strict_types=1);

// Security headers for all responses.
// Note: CSP is intentionally strict; loosen only when needed.

header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('Permissions-Policy: geolocation=(), microphone=(), camera=()');

// Basic CSP (allows needed CDNs used in current UI).
// If you later remove inline scripts/styles, remove 'unsafe-inline'.
$csp = implode('; ', [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
  "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://unpkg.com",
  "connect-src 'self'",
]);
header("Content-Security-Policy: {$csp}");

// Use HSTS only when you serve HTTPS.
// header('Strict-Transport-Security: max-age=31536000; includeSubDomains');


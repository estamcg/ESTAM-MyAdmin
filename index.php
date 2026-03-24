<?php
declare(strict_types=1);

require_once __DIR__ . '/api/security_headers.php';

if (session_status() === PHP_SESSION_NONE) {
  ini_set('session.use_strict_mode', '1');
  ini_set('session.cookie_httponly', '1');
  ini_set('session.cookie_samesite', 'Lax');
  if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
    ini_set('session.cookie_secure', '1');
  }
  session_start();
}

if (empty($_SESSION['admin_id'])) {
  header('Location: login.php');
  exit;
}

// Serve existing app HTML (index.html) as the main UI
readfile(__DIR__ . '/index.html');


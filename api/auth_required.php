<?php
declare(strict_types=1);

// Utilisation :
//   require_once __DIR__ . '/auth_required.php';

require_once __DIR__ . '/security_headers.php';

if (session_status() === PHP_SESSION_NONE) {
  // Secure-ish session defaults (works without php.ini edits)
  ini_set('session.use_strict_mode', '1');
  ini_set('session.cookie_httponly', '1');
  ini_set('session.cookie_samesite', 'Lax');
  if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
    ini_set('session.cookie_secure', '1');
  }
  session_start();
}

// Ne pas envoyer d'en-tête JSON ici - laisser l'appelant le faire
// car certains endpoints peuvent avoir besoin d'autres en-têtes

if (empty($_SESSION['admin_id'])) {
  http_response_code(401);
  // Vérifier si les en-têtes n'ont pas déjà été envoyés
  if (!headers_sent()) {
    header('Content-Type: application/json; charset=utf-8');
  }
  echo json_encode([
    'status' => 'error',
    'message' => 'Non autorisé. Veuillez vous connecter.'
  ]);
  exit;
}
<?php
declare(strict_types=1);

require_once __DIR__ . '/security_headers.php';
header('Content-Type: application/json; charset=utf-8');
if (session_status() === PHP_SESSION_NONE) {
  session_start();
}

session_unset();
session_destroy();

echo json_encode([
  'status' => 'success',
  'message' => 'Déconnexion effectuée.'
]);


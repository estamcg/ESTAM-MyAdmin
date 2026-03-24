<?php
declare(strict_types=1);

require_once __DIR__ . '/auth_required.php';

header('Content-Type: application/json; charset=utf-8');

echo json_encode([
  'status' => 'success',
  'user' => [
    'id' => (int)($_SESSION['admin_id'] ?? 0),
    'username' => (string)($_SESSION['admin_username'] ?? ''),
    'display_name' => (string)($_SESSION['admin_display_name'] ?? ''),
    'role' => (string)($_SESSION['admin_role'] ?? ''),
    'is_super_admin' => stripos((string)($_SESSION['admin_role'] ?? ''), 'super') !== false,
  ]
]);


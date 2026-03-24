<?php
declare(strict_types=1);

require_once __DIR__ . '/auth_required.php';
require_once __DIR__ . '/db_connect.php';

header('Content-Type: application/json; charset=utf-8');

try {
  $sessionAdminId = (int)($_SESSION['admin_id'] ?? 0);
  $sessionRoleRaw = trim((string)($_SESSION['admin_role'] ?? ''));
  $roleNorm = mb_strtolower($sessionRoleRaw);
  $isSuperAdmin = str_contains($roleNorm, 'super');
  $isAdmin = $isSuperAdmin || str_contains($roleNorm, 'admin');

  if ($isAdmin) {
    $pdo->exec("TRUNCATE TABLE notifications");
  } else {
    $stmt = $pdo->prepare("DELETE FROM notifications WHERE created_by_admin_id = ?");
    $stmt->execute([$sessionAdminId]);
  }
  echo json_encode(['status' => 'success']);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}


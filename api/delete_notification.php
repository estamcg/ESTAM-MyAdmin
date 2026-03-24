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

  $data = json_decode((string)file_get_contents('php://input'), true);
  $id = (int)($data['id'] ?? 0);
  if ($id <= 0) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'ID invalide.']);
    exit;
  }
  if ($isAdmin) {
    $stmt = $pdo->prepare("DELETE FROM notifications WHERE id = ?");
    $stmt->execute([$id]);
  } else {
    $stmt = $pdo->prepare("DELETE FROM notifications WHERE id = ? AND created_by_admin_id = ?");
    $stmt->execute([$id, $sessionAdminId]);
    if ($stmt->rowCount() === 0) {
      http_response_code(403);
      echo json_encode(['status' => 'error', 'message' => 'Suppression non autorisee.']);
      exit;
    }
  }
  echo json_encode(['status' => 'success']);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}


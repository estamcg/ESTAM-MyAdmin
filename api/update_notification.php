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
  if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Requête invalide.']);
    exit;
  }

  $action = trim((string)($data['action'] ?? ''));
  $id = (int)($data['id'] ?? 0);

  if ($action === 'mark_read' && $id > 0) {
    if ($isAdmin) {
      $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE id = ?");
      $stmt->execute([$id]);
    } else {
      $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE id = ? AND created_by_admin_id = ?");
      $stmt->execute([$id, $sessionAdminId]);
      if ($stmt->rowCount() === 0) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Action non autorisee.']);
        exit;
      }
    }
    echo json_encode(['status' => 'success']);
    exit;
  }

  if ($action === 'mark_all_read') {
    if ($isAdmin) {
      $pdo->exec("UPDATE notifications SET is_read = 1 WHERE is_read = 0");
    } else {
      $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE is_read = 0 AND created_by_admin_id = ?");
      $stmt->execute([$sessionAdminId]);
    }
    echo json_encode(['status' => 'success']);
    exit;
  }

  http_response_code(422);
  echo json_encode(['status' => 'error', 'message' => 'Action invalide.']);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}


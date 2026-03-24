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
    echo json_encode(['status' => 'error', 'message' => 'Requete invalide.']);
    exit;
  }

  $type = trim((string)($data['type'] ?? ''));
  $read = trim((string)($data['read'] ?? '')); // read|unread|''
  $beforeDate = trim((string)($data['before_date'] ?? '')); // YYYY-MM-DD
  $autoOnly = isset($data['auto_only']) ? (bool)$data['auto_only'] : null;

  $sql = "DELETE FROM notifications WHERE 1=1";
  $params = [];

  if (!$isAdmin) {
    $sql .= " AND created_by_admin_id = ?";
    $params[] = $sessionAdminId;
  }
  if ($type !== '') {
    $sql .= " AND type = ?";
    $params[] = $type;
  }
  if ($read === 'read') {
    $sql .= " AND is_read = 1";
  } elseif ($read === 'unread') {
    $sql .= " AND is_read = 0";
  }
  if ($beforeDate !== '') {
    $dt = DateTimeImmutable::createFromFormat('Y-m-d', $beforeDate);
    if (!$dt) {
      http_response_code(422);
      echo json_encode(['status' => 'error', 'message' => 'before_date invalide (YYYY-MM-DD).']);
      exit;
    }
    $sql .= " AND DATE(COALESCE(sent_at, created_at)) <= ?";
    $params[] = $dt->format('Y-m-d');
  }
  if ($autoOnly !== null) {
    $sql .= " AND auto_generated = ?";
    $params[] = $autoOnly ? 1 : 0;
  }

  $stmt = $pdo->prepare($sql);
  $stmt->execute($params);

  echo json_encode([
    'status' => 'success',
    'deleted' => (int)$stmt->rowCount(),
  ]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}


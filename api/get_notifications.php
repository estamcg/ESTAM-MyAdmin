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

  // Auto-send scheduled notifications that are due
  $pdo->exec("
    UPDATE notifications
    SET sent = 1, sent_at = NOW(), is_read = 0
    WHERE sent = 0 AND scheduled_for IS NOT NULL AND scheduled_for <= NOW()
  ");

  $type = trim((string)($_GET['type'] ?? ''));
  $read = trim((string)($_GET['read'] ?? '')); // unread|read
  $historyPage = max(1, (int)($_GET['history_page'] ?? 1));
  $historyPerPage = (int)($_GET['history_per_page'] ?? 10);
  if ($historyPerPage < 1) $historyPerPage = 10;
  if ($historyPerPage > 100) $historyPerPage = 100;

  $sql = "SELECT * FROM notifications WHERE 1=1";
  $params = [];
  if ($type !== '') {
    $sql .= " AND type = ?";
    $params[] = $type;
  }
  if ($read === 'unread') {
    $sql .= " AND is_read = 0";
  } elseif ($read === 'read') {
    $sql .= " AND is_read = 1";
  }
  $sql .= " ORDER BY COALESCE(sent_at, created_at) DESC, id DESC";

  $stmt = $pdo->prepare($sql);
  $stmt->execute($params);
  $allRows = $stmt->fetchAll();

  $visibleRows = [];
  foreach ($allRows as $r) {
    $createdBy = (int)($r['created_by_admin_id'] ?? 0);
    $destRaw = (string)($r['destinataires_json'] ?? '[]');
    $destinataires = json_decode($destRaw, true);
    $destinataires = is_array($destinataires) ? $destinataires : [];
    $destJoined = mb_strtolower(implode(' ', array_map(static fn($v) => (string)$v, $destinataires)));

    $canSee = false;
    if ($isAdmin) {
      $canSee = true;
    } elseif ($createdBy > 0 && $createdBy === $sessionAdminId) {
      $canSee = true;
    } elseif (str_contains($roleNorm, 'formateur')) {
      $canSee = str_contains($destJoined, 'formateur') || str_contains($destJoined, 'tous');
    } elseif (str_contains($roleNorm, 'partenaire')) {
      $canSee = str_contains($destJoined, 'partenaire') || str_contains($destJoined, 'tous');
    } else {
      $canSee = true;
    }

    if (!$canSee) continue;
    $r['destinataires'] = $destinataires;
    $visibleRows[] = $r;
  }

  $totalHistory = count($visibleRows);
  $totalPages = max(1, (int)ceil($totalHistory / $historyPerPage));
  if ($historyPage > $totalPages) $historyPage = $totalPages;
  $offset = ($historyPage - 1) * $historyPerPage;
  $historyRows = array_slice($visibleRows, $offset, $historyPerPage);

  echo json_encode([
    'status' => 'success',
    'data' => $visibleRows,
    'history' => $historyRows,
    'meta_history' => [
      'total' => $totalHistory,
      'page' => $historyPage,
      'per_page' => $historyPerPage,
      'total_pages' => $totalPages,
      'has_prev' => $historyPage > 1,
      'has_next' => $historyPage < $totalPages,
    ]
  ]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}


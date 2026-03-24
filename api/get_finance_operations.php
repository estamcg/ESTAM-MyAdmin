<?php
declare(strict_types=1);

require_once __DIR__ . '/auth_required.php';
require_once __DIR__ . '/db_connect.php';

header('Content-Type: application/json; charset=utf-8');

try {
  $q = trim((string)($_GET['q'] ?? ''));
  $type = trim((string)($_GET['type'] ?? ''));
  $dateFrom = trim((string)($_GET['date_from'] ?? ''));
  $dateTo = trim((string)($_GET['date_to'] ?? ''));

  $sql = "SELECT id, type, categorie, libelle, piece_no, montant, date_op, created_at, updated_at FROM finance_operations WHERE 1=1";
  $params = [];
  if ($q !== '') {
    $sql .= " AND (piece_no LIKE ? OR libelle LIKE ? OR categorie LIKE ?)";
    $like = '%' . $q . '%';
    $params[] = $like;
    $params[] = $like;
    $params[] = $like;
  }
  if ($type === 'Encaissement' || $type === 'Décaissement') {
    $sql .= " AND type = ?";
    $params[] = $type;
  }
  if ($dateFrom !== '') {
    $sql .= " AND date_op >= ?";
    $params[] = $dateFrom;
  }
  if ($dateTo !== '') {
    $sql .= " AND date_op <= ?";
    $params[] = $dateTo;
  }
  $sql .= " ORDER BY date_op DESC, id DESC";

  $stmt = $pdo->prepare($sql);
  $stmt->execute($params);
  $rows = $stmt->fetchAll();

  echo json_encode(['status' => 'success', 'data' => $rows]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}


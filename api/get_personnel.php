<?php
declare(strict_types=1);

require_once __DIR__ . '/auth_required.php';
require_once __DIR__ . '/db_connect.php';

header('Content-Type: application/json; charset=utf-8');

try {
  $q = trim((string)($_GET['q'] ?? ''));
  $type = trim((string)($_GET['type'] ?? ''));

  $sql = "SELECT * FROM personnel WHERE 1=1";
  $params = [];
  if ($q !== '') {
    $sql .= " AND (nom LIKE ? OR prenom LIKE ? OR fonction LIKE ? OR email LIKE ?)";
    $like = '%' . $q . '%';
    $params[] = $like;
    $params[] = $like;
    $params[] = $like;
    $params[] = $like;
  }
  if ($type !== '') {
    if ($type === 'Interne') {
      $sql .= " AND type = 'Administration'";
    } elseif ($type === 'Externe') {
      $sql .= " AND type IN ('Formateur','Partenaire')";
    } else {
      $sql .= " AND type = ?";
      $params[] = $type;
    }
  }
  $sql .= " ORDER BY created_at DESC, id DESC";

  $stmt = $pdo->prepare($sql);
  $stmt->execute($params);
  $rows = $stmt->fetchAll();

  echo json_encode(['status' => 'success', 'data' => $rows]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}


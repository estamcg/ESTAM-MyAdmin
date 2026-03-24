<?php
declare(strict_types=1);

require_once __DIR__ . '/auth_required.php';
require_once __DIR__ . '/db_connect.php';

header('Content-Type: application/json; charset=utf-8');

try {
  $filters = [
    'secteur_key' => trim((string)($_GET['secteur_key'] ?? '')),
    'niveau' => trim((string)($_GET['niveau'] ?? '')),
    'filiere_acro' => trim((string)($_GET['filiere_acro'] ?? '')),
    'vague' => trim((string)($_GET['vague'] ?? '')),
    'type_planning' => trim((string)($_GET['type_planning'] ?? '')),
  ];
  $sql = "SELECT * FROM academic_plannings WHERE 1=1";
  $params = [];
  foreach ($filters as $k => $v) {
    if ($v !== '') {
      $sql .= " AND {$k} = ?";
      $params[] = $v;
    }
  }
  $sql .= " ORDER BY created_at DESC, id DESC";
  $stmt = $pdo->prepare($sql);
  $stmt->execute($params);
  echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll()]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}


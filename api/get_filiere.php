<?php
declare(strict_types=1);

require_once __DIR__ . '/auth_required.php';
require_once __DIR__ . '/db_connect.php';

header('Content-Type: application/json; charset=utf-8');

try {
  $secteurKey = isset($_GET['secteur_key']) ? trim((string)$_GET['secteur_key']) : '';

  if ($secteurKey !== '') {
    $stmt = $pdo->prepare("SELECT id, secteur_key, acro, label FROM filiere WHERE secteur_key = ? ORDER BY acro ASC");
    $stmt->execute([$secteurKey]);
  } else {
    $stmt = $pdo->query("SELECT id, secteur_key, acro, label FROM filiere ORDER BY secteur_key ASC, acro ASC");
  }

  $rows = $stmt->fetchAll();
  echo json_encode([
    'status' => 'success',
    'data' => $rows
  ]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}


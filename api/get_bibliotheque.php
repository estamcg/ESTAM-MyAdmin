<?php
declare(strict_types=1);

require_once __DIR__ . '/auth_required.php';
require_once __DIR__ . '/db_connect.php';

header('Content-Type: application/json; charset=utf-8');

try {
  $q = trim((string)($_GET['q'] ?? ''));
  $categorie = trim((string)($_GET['categorie'] ?? ''));
  $sql = "SELECT * FROM bibliotheque_documents WHERE 1=1";
  $params = [];
  if ($q !== '') {
    $like = '%' . $q . '%';
    $sql .= " AND (titre LIKE ? OR description LIKE ? OR fichier_nom LIKE ?)";
    $params[] = $like; $params[] = $like; $params[] = $like;
  }
  if ($categorie !== '') {
    $sql .= " AND categorie = ?";
    $params[] = $categorie;
  }
  $sql .= " ORDER BY created_at DESC, id DESC";
  $stmt = $pdo->prepare($sql);
  $stmt->execute($params);
  echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll()]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}


<?php
declare(strict_types=1);

require_once __DIR__ . '/auth_required.php';
require_once __DIR__ . '/db_connect.php';

header('Content-Type: application/json; charset=utf-8');

try {
  $id = $_GET['id'] ?? null;
  if (!is_numeric($id)) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'ID invalide.']);
    exit;
  }
  $id = (int)$id;

  $sql = "
    SELECT
      e.*,
      f.acro AS filiere_acro,
      f.label AS filiere_label,
      f.secteur_key AS filiere_secteur_key
    FROM etudiants e
    INNER JOIN filiere f ON f.id = e.filiere_id
    WHERE e.id = ?
    LIMIT 1
  ";
  $stmt = $pdo->prepare($sql);
  $stmt->execute([$id]);
  $row = $stmt->fetch();

  if (!$row) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Étudiant introuvable.']);
    exit;
  }

  echo json_encode(['status' => 'success', 'data' => $row]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}


<?php
declare(strict_types=1);

require_once __DIR__ . '/auth_required.php';
require_once __DIR__ . '/db_connect.php';

header('Content-Type: application/json; charset=utf-8');

try {
  $raw = file_get_contents('php://input') ?: '';
  $data = json_decode($raw, true);
  if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Requête invalide.']);
    exit;
  }

  $id = $data['id'] ?? null;
  if (!is_numeric($id)) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'ID filière invalide.']);
    exit;
  }
  $id = (int)$id;

  // Restriction FK: ON DELETE RESTRICT => on protège aussi côté API
  $stmt = $pdo->prepare("SELECT COUNT(*) FROM etudiants WHERE filiere_id = ?");
  $stmt->execute([$id]);
  $count = (int)$stmt->fetchColumn();
  if ($count > 0) {
    http_response_code(409);
    echo json_encode([
      'status' => 'error',
      'message' => "Suppression refusée : ".$count." étudiant(s) liés à cette filière."
    ]);
    exit;
  }

  $stmt = $pdo->prepare("DELETE FROM filiere WHERE id = ?");
  $stmt->execute([$id]);

  if ($stmt->rowCount() === 0) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Filière introuvable.']);
    exit;
  }

  echo json_encode(['status' => 'success', 'message' => 'Filière supprimée.']);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}


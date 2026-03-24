<?php
declare(strict_types=1);

require_once __DIR__ . '/auth_required.php';
require_once __DIR__ . '/db_connect.php';

header('Content-Type: application/json; charset=utf-8');

try {
  $data = json_decode((string)file_get_contents('php://input'), true);
  $id = (int)($data['id'] ?? 0);
  if ($id <= 0) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'ID invalide.']);
    exit;
  }
  $stmt = $pdo->prepare("SELECT id, fichier_path FROM academic_plannings WHERE id=? LIMIT 1");
  $stmt->execute([$id]);
  $p = $stmt->fetch();
  if (!$p) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Planning introuvable.']);
    exit;
  }
  $stmt = $pdo->prepare("DELETE FROM academic_plannings WHERE id=?");
  $stmt->execute([$id]);
  $abs = __DIR__ . '/../' . (string)$p['fichier_path'];
  if (is_file($abs)) @unlink($abs);
  echo json_encode(['status' => 'success']);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}


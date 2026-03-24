<?php
declare(strict_types=1);

require_once __DIR__ . '/auth_required.php';
require_once __DIR__ . '/db_connect.php';

header('Content-Type: application/json; charset=utf-8');

function respond(string $status, string $message, int $code, array $extra = []): void {
  http_response_code($code);
  echo json_encode(array_merge([
    'status' => $status,
    'message' => $message,
  ], $extra));
  exit;
}

try {
  $raw = file_get_contents('php://input') ?: '';
  $data = json_decode($raw, true);
  if (!is_array($data)) respond('error', 'Requête invalide.', 400);

  $id = $data['id'] ?? null;
  if (!is_numeric($id)) respond('error', 'ID filière invalide.', 422);
  $id = (int)$id;

  $secteurKey = trim((string)($data['secteur_key'] ?? ''));
  $acro = strtoupper(trim((string)($data['acro'] ?? '')));
  $label = trim((string)($data['label'] ?? ''));

  if ($secteurKey === '' || $acro === '' || $label === '') {
    respond('error', 'Champs requis : secteur_key, acro, label.', 422);
  }
  if (!preg_match('/^[A-Z0-9]{1,16}$/', $acro)) {
    respond('error', 'Format acro invalide.', 422);
  }

  $stmt = $pdo->prepare("UPDATE filiere SET secteur_key = ?, acro = ?, label = ?, updated_at = NOW() WHERE id = ?");
  $stmt->execute([$secteurKey, $acro, $label, $id]);

  if ($stmt->rowCount() === 0) {
    respond('error', 'Aucune filière mise à jour (ID introuvable).', 404);
  }

  respond('success', 'Filière mise à jour.', 200);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}


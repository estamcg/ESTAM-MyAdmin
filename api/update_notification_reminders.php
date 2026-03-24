<?php
declare(strict_types=1);

require_once __DIR__ . '/auth_required.php';
require_once __DIR__ . '/db_connect.php';

header('Content-Type: application/json; charset=utf-8');

try {
  $adminId = (int)($_SESSION['admin_id'] ?? 0);
  $data = json_decode((string)file_get_contents('php://input'), true);
  if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Requête invalide.']);
    exit;
  }
  $key = trim((string)($data['reminder_key'] ?? ''));
  if (!in_array($key, ['paiement', 'inscription'], true)) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Rappel invalide.']);
    exit;
  }
  $active = !empty($data['active']) ? 1 : 0;
  $config = $data['config'] ?? [];

  $stmt = $pdo->prepare("
    INSERT INTO notification_reminders (reminder_key, active, config_json, updated_by_admin_id)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      active = VALUES(active),
      config_json = VALUES(config_json),
      updated_by_admin_id = VALUES(updated_by_admin_id)
  ");
  $stmt->execute([$key, $active, json_encode($config, JSON_UNESCAPED_UNICODE), $adminId]);

  echo json_encode(['status' => 'success']);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}


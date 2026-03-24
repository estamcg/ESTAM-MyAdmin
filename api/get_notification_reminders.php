<?php
declare(strict_types=1);

require_once __DIR__ . '/auth_required.php';
require_once __DIR__ . '/db_connect.php';

header('Content-Type: application/json; charset=utf-8');

try {
  $stmt = $pdo->query("SELECT reminder_key, active, config_json FROM notification_reminders ORDER BY reminder_key ASC");
  $rows = $stmt->fetchAll();
  $data = [];
  foreach ($rows as $r) {
    $cfg = json_decode((string)($r['config_json'] ?? '{}'), true);
    if (!is_array($cfg)) $cfg = [];
    $data[(string)$r['reminder_key']] = [
      'active' => (int)$r['active'] === 1,
      'config' => $cfg,
    ];
  }
  echo json_encode(['status' => 'success', 'data' => $data]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}


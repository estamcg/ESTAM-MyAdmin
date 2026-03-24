<?php
declare(strict_types=1);

require_once __DIR__ . '/auth_required.php';
require_once __DIR__ . '/db_connect.php';

header('Content-Type: application/json; charset=utf-8');

function normalize_photo(?string $raw): ?string {
  $s = trim((string)$raw);
  if ($s === '' || strtolower($s) === 'null' || strtolower($s) === 'undefined') return null;
  if (($s[0] ?? '') === '"' && substr($s, -1) === '"') $s = trim(substr($s, 1, -1));
  if (($s[0] ?? '') === "'" && substr($s, -1) === "'") $s = trim(substr($s, 1, -1));

  if (preg_match('/^data:image\//i', $s) || str_starts_with($s, 'blob:') || preg_match('/^https?:\/\//i', $s)) return $s;

  $compact = preg_replace('/\s+/', '', $s) ?? $s;
  if (strlen($compact) > 120 && preg_match('/^[A-Za-z0-9+\/=]+$/', $compact)) {
    return 'data:image/jpeg;base64,' . $compact;
  }

  $s = str_replace('\\', '/', $s);
  $lower = strtolower($s);
  $idx = strpos($lower, '/uploads/');
  if ($idx !== false) $s = substr($s, $idx + 1);
  if (preg_match('/^[A-Za-z]:\//', $s)) return null;
  if (str_starts_with($s, './')) $s = substr($s, 2);
  return $s;
}

try {
  $sessionRole = strtolower((string)($_SESSION['admin_role'] ?? ''));
  if (!str_contains($sessionRole, 'admin')) {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Accès refusé.']);
    exit;
  }

  $targets = [
    ['table' => 'etudiants', 'id' => 'id', 'col' => 'photo_data_url'],
    ['table' => 'personnel', 'id' => 'id', 'col' => 'photo_data_url'],
    ['table' => 'admin_profiles', 'id' => 'id', 'col' => 'photo_data_url'],
  ];

  $updated = 0;
  $scanned = 0;
  foreach ($targets as $t) {
    $rows = $pdo->query("SELECT {$t['id']} AS rid, {$t['col']} AS photo FROM {$t['table']}")->fetchAll();
    $stmt = $pdo->prepare("UPDATE {$t['table']} SET {$t['col']} = ? WHERE {$t['id']} = ?");
    foreach ($rows as $r) {
      $scanned++;
      $old = (string)($r['photo'] ?? '');
      $new = normalize_photo($old);
      $newStr = $new ?? '';
      if ($newStr !== $old) {
        $stmt->execute([$newStr !== '' ? $newStr : null, (int)$r['rid']]);
        $updated++;
      }
    }
  }

  echo json_encode([
    'status' => 'success',
    'message' => 'Migration photos terminée.',
    'scanned' => $scanned,
    'updated' => $updated
  ]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}


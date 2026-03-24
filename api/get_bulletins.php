<?php
declare(strict_types=1);

require_once __DIR__ . '/auth_required.php';
require_once __DIR__ . '/db_connect.php';
header('Content-Type: application/json; charset=utf-8');

try {
  $pdo->exec("CREATE TABLE IF NOT EXISTS academic_bulletins (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    etudiant_id INT UNSIGNED NOT NULL,
    annee VARCHAR(32) NOT NULL,
    semestre VARCHAR(16) NOT NULL,
    ues_json LONGTEXT NOT NULL,
    moyenne_generale DECIMAL(5,2) NULL,
    decision_jury VARCHAR(64) NULL,
    created_by_admin_id INT UNSIGNED NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_bulletin_unique (etudiant_id, annee, semestre)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

  $stmt = $pdo->query("SELECT id, etudiant_id, annee, semestre, ues_json, moyenne_generale, decision_jury, created_at, updated_at FROM academic_bulletins ORDER BY updated_at DESC, id DESC");
  $rows = [];
  foreach ($stmt->fetchAll() as $r) {
    $ues = [];
    try { $ues = json_decode((string)$r['ues_json'], true, 512, JSON_THROW_ON_ERROR); } catch (Throwable $e) {}
    $rows[] = [
      'id' => (int)$r['id'],
      'etudId' => (int)$r['etudiant_id'],
      'annee' => (string)$r['annee'],
      'semestre' => (string)$r['semestre'],
      'ues' => is_array($ues) ? $ues : [],
      'savedAt' => (string)($r['updated_at'] ?: $r['created_at']),
      'moyenne_generale' => $r['moyenne_generale'] !== null ? (float)$r['moyenne_generale'] : null,
      'decision_jury' => (string)($r['decision_jury'] ?? '')
    ];
  }
  echo json_encode(['status'=>'success', 'data'=>$rows]);
} catch (Throwable $e) {
  http_response_code(500); echo json_encode(['status'=>'error','message'=>'Erreur serveur.']);
}


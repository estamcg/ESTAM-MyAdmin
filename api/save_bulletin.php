<?php
declare(strict_types=1);

require_once __DIR__ . '/auth_required.php';
require_once __DIR__ . '/db_connect.php';
header('Content-Type: application/json; charset=utf-8');

function decision_from_mg(?float $mg): ?string {
  if ($mg === null) return null;
  if ($mg >= 10) return 'Validé';
  if ($mg >= 6) return 'Rattrapage';
  return 'Éliminé';
}

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

  $data = json_decode((string)file_get_contents('php://input'), true);
  if (!is_array($data)) { http_response_code(400); echo json_encode(['status'=>'error','message'=>'Requête invalide.']); exit; }

  $id = (int)($data['id'] ?? 0);
  $etudId = (int)($data['etudId'] ?? 0);
  $annee = trim((string)($data['annee'] ?? ''));
  $sem = trim((string)($data['semestre'] ?? ''));
  $ues = $data['ues'] ?? [];
  if ($etudId <= 0 || $annee === '' || $sem === '' || !is_array($ues)) {
    http_response_code(422); echo json_encode(['status'=>'error','message'=>'Champs invalides.']); exit;
  }
  $mg = isset($data['moyenne_generale']) && $data['moyenne_generale'] !== null ? (float)$data['moyenne_generale'] : null;
  $decision = trim((string)($data['decision_jury'] ?? ''));
  if ($decision === '') $decision = (string)decision_from_mg($mg);

  if ($id > 0) {
    $stmt = $pdo->prepare("UPDATE academic_bulletins SET etudiant_id=?, annee=?, semestre=?, ues_json=?, moyenne_generale=?, decision_jury=? WHERE id=?");
    $stmt->execute([$etudId, $annee, $sem, json_encode($ues, JSON_UNESCAPED_UNICODE), $mg, $decision !== '' ? $decision : null, $id]);
  } else {
    $stmt = $pdo->prepare("INSERT INTO academic_bulletins (etudiant_id, annee, semestre, ues_json, moyenne_generale, decision_jury, created_by_admin_id)
      VALUES (?,?,?,?,?,?,?)
      ON DUPLICATE KEY UPDATE ues_json=VALUES(ues_json), moyenne_generale=VALUES(moyenne_generale), decision_jury=VALUES(decision_jury), updated_at=CURRENT_TIMESTAMP");
    $stmt->execute([$etudId, $annee, $sem, json_encode($ues, JSON_UNESCAPED_UNICODE), $mg, $decision !== '' ? $decision : null, (int)($_SESSION['admin_id'] ?? 0)]);
    if ($id <= 0) {
      $q = $pdo->prepare("SELECT id FROM academic_bulletins WHERE etudiant_id=? AND annee=? AND semestre=? LIMIT 1");
      $q->execute([$etudId, $annee, $sem]);
      $row = $q->fetch();
      $id = (int)($row['id'] ?? 0);
    }
  }

  echo json_encode(['status'=>'success','id'=>$id]);
} catch (Throwable $e) {
  http_response_code(500); echo json_encode(['status'=>'error','message'=>'Erreur serveur.']);
}


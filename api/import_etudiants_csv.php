<?php
declare(strict_types=1);

require_once __DIR__ . '/auth_required.php';
require_once __DIR__ . '/db_connect.php';

header('Content-Type: application/json; charset=utf-8');

function respond(string $status, string $message, int $code = 200, array $extra = []): void {
  http_response_code($code);
  echo json_encode(array_merge([
    'status' => $status,
    'message' => $message,
  ], $extra));
  exit;
}

function toDateOrNull($v): ?string {
  $s = trim((string)$v);
  if ($s === '') return null;
  $t = strtotime($s);
  if ($t === false) return null;
  return date('Y-m-d', $t);
}

function normalizeStr(string $v): string {
  $v = trim($v);
  $v = mb_strtolower($v);
  $map = ['é'=>'e','è'=>'e','ê'=>'e','ë'=>'e','à'=>'a','â'=>'a','î'=>'i','ï'=>'i','ô'=>'o','ö'=>'o','ù'=>'u','û'=>'u','ü'=>'u','ç'=>'c'];
  return strtr($v, $map);
}

try {
  $payload = json_decode((string)file_get_contents('php://input'), true);
  if (!is_array($payload) || !isset($payload['rows']) || !is_array($payload['rows'])) {
    respond('error', 'Requete invalide.', 400);
  }

  $rows = $payload['rows'];
  if (!$rows) {
    respond('error', 'Aucune ligne a importer.', 422);
  }

  // Cache filieres by acro and label
  $filiereByAcro = [];
  $filiereByLabel = [];
  $stmtFil = $pdo->query("SELECT id, acro, label, secteur_key FROM filiere");
  foreach ($stmtFil->fetchAll() as $f) {
    $filiereByAcro[mb_strtoupper((string)$f['acro'])] = $f;
    $filiereByLabel[normalizeStr((string)$f['label'])] = $f;
  }

  $insertSql = "
    INSERT INTO etudiants (
      matricule, dossier, nom, prenom, secteur_key, filiere_id, niveau,
      date_inscription, naissance, lieu_naissance, adresse, ville, arrondissement,
      tel1, tel2, whatsapp, email,
      tuteur_nom, tuteur_profession, tuteur_tel1, tuteur_tel2,
      frais_inscription, frais_carte, frais_mois, frais_extra,
      mode_paiement, statut, anciennete, photo_data_url
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?
    )
  ";
  $stmtIns = $pdo->prepare($insertSql);
  $stmtCheckMat = $pdo->prepare("SELECT id FROM etudiants WHERE matricule = ? LIMIT 1");

  $inserted = 0;
  $skipped = 0;
  $errors = [];

  $pdo->beginTransaction();
  foreach ($rows as $idx => $r) {
    if (!is_array($r)) {
      $skipped++;
      continue;
    }

    $nom = trim((string)($r['nom'] ?? ''));
    $prenom = trim((string)($r['prenom'] ?? ''));
    $fullName = trim((string)($r['nom_complet'] ?? ''));
    if ($prenom === '' && $fullName !== '' && str_contains($fullName, ' ')) {
      $parts = preg_split('/\s+/', $fullName);
      $nom = trim((string)($parts[0] ?? $nom));
      $prenom = trim(implode(' ', array_slice($parts, 1)));
    }
    if ($nom === '' && $fullName !== '') $nom = $fullName;
    if ($nom === '') {
      $skipped++;
      $errors[] = ['line' => $idx + 2, 'message' => 'Nom manquant'];
      continue;
    }

    $filiereRaw = trim((string)($r['filiere'] ?? ($r['filiere_acro'] ?? '')));
    $filiereAcro = mb_strtoupper($filiereRaw);
    $filiere = $filiereByAcro[$filiereAcro] ?? null;
    if ($filiere === null && $filiereRaw !== '') {
      $filiere = $filiereByLabel[normalizeStr($filiereRaw)] ?? null;
    }
    if ($filiere === null) {
      $skipped++;
      $errors[] = ['line' => $idx + 2, 'message' => 'Filiere introuvable: ' . $filiereRaw];
      continue;
    }

    $matricule = trim((string)($r['matricule'] ?? ''));
    if ($matricule === '') {
      $year2 = date('y');
      $matricule = sprintf('%sE%05d', $year2, $idx + 1);
    }
    $stmtCheckMat->execute([$matricule]);
    if ($stmtCheckMat->fetch()) {
      $skipped++;
      $errors[] = ['line' => $idx + 2, 'message' => 'Matricule deja existant: ' . $matricule];
      continue;
    }

    $niveau = trim((string)($r['niveau'] ?? 'L1'));
    $secteurKey = trim((string)($r['secteur_key'] ?? $filiere['secteur_key'] ?? ''));
    if ($secteurKey === '') $secteurKey = 'SG';

    $stmtIns->execute([
      $matricule,
      trim((string)($r['dossier'] ?? '')) ?: null,
      $nom,
      $prenom,
      $secteurKey,
      (int)$filiere['id'],
      $niveau !== '' ? $niveau : 'L1',
      toDateOrNull($r['date_inscription'] ?? ($r['date inscription'] ?? '')) ?: date('Y-m-d'),
      toDateOrNull($r['naissance'] ?? ''),
      trim((string)($r['lieu_naissance'] ?? '')) ?: null,
      trim((string)($r['adresse'] ?? '')) ?: null,
      trim((string)($r['ville'] ?? '')) ?: null,
      trim((string)($r['arrondissement'] ?? '')) ?: null,
      trim((string)($r['tel1'] ?? ($r['telephone'] ?? ''))) ?: null,
      trim((string)($r['tel2'] ?? '')) ?: null,
      trim((string)($r['whatsapp'] ?? '')) ?: null,
      trim((string)($r['email'] ?? '')) ?: null,
      trim((string)($r['tuteur_nom'] ?? '')) ?: null,
      trim((string)($r['tuteur_profession'] ?? '')) ?: null,
      trim((string)($r['tuteur_tel1'] ?? '')) ?: null,
      trim((string)($r['tuteur_tel2'] ?? '')) ?: null,
      (float)($r['frais_inscription'] ?? 0),
      (float)($r['frais_carte'] ?? 0),
      (float)($r['frais_mois'] ?? 0),
      (float)($r['frais_extra'] ?? 0),
      trim((string)($r['mode_paiement'] ?? 'Espèces')) ?: 'Espèces',
      trim((string)($r['statut'] ?? 'Actif')) ?: 'Actif',
      trim((string)($r['anciennete'] ?? 'Nouveau')) ?: 'Nouveau',
      trim((string)($r['photo_data_url'] ?? '')) ?: null,
    ]);
    $inserted++;
  }
  $pdo->commit();

  respond('success', 'Import termine.', 200, [
    'total' => count($rows),
    'inserted' => $inserted,
    'skipped' => $skipped,
    'errors' => $errors,
  ]);
} catch (Throwable $e) {
  if ($pdo->inTransaction()) $pdo->rollBack();
  respond('error', 'Erreur serveur lors de l import CSV.', 500);
}


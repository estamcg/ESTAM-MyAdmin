<?php
declare(strict_types=1);

require_once __DIR__ . '/auth_required.php';
require_once __DIR__ . '/db_connect.php';
header('Content-Type: application/json; charset=utf-8');

try {
  $pdo->exec("CREATE TABLE IF NOT EXISTS finance_receipts (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    numero VARCHAR(64) NOT NULL,
    etudiant_id INT UNSIGNED NULL,
    nom VARCHAR(160) NOT NULL,
    formation VARCHAR(255) NOT NULL,
    somme DECIMAL(12,2) NOT NULL DEFAULT 0,
    avance DECIMAL(12,2) NOT NULL DEFAULT 0,
    reste DECIMAL(12,2) NOT NULL DEFAULT 0,
    date_recu DATE NOT NULL,
    motif VARCHAR(120) NULL,
    bpf VARCHAR(255) NULL,
    created_by_admin_id INT UNSIGNED NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_fin_receipt_num (numero)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

  $data = json_decode((string)file_get_contents('php://input'), true);
  if (!is_array($data)) { http_response_code(400); echo json_encode(['status'=>'error','message'=>'Requête invalide.']); exit; }
  $id = (int)($data['id'] ?? 0);
  $numero = trim((string)($data['numero'] ?? ''));
  $nom = trim((string)($data['nom'] ?? ''));
  $formation = trim((string)($data['formation'] ?? ''));
  $somme = (float)($data['somme'] ?? 0);
  $date = trim((string)($data['date'] ?? ''));
  if ($numero === '' || $nom === '' || $formation === '' || $somme <= 0 || $date === '') {
    http_response_code(422); echo json_encode(['status'=>'error','message'=>'Champs obligatoires invalides.']); exit;
  }
  $avance = (float)($data['avance'] ?? 0);
  $reste = (float)($data['reste'] ?? max(0, $somme - $avance));
  $motif = trim((string)($data['motif'] ?? ''));
  $bpf = trim((string)($data['bpf'] ?? ''));
  $etudId = isset($data['etudId']) ? (int)$data['etudId'] : null;
  if ($etudId !== null && $etudId <= 0) $etudId = null;

  $pdo->beginTransaction();
  if ($id > 0) {
    $stmt = $pdo->prepare("UPDATE finance_receipts SET numero=?, etudiant_id=?, nom=?, formation=?, somme=?, avance=?, reste=?, date_recu=?, motif=?, bpf=? WHERE id=?");
    $stmt->execute([$numero,$etudId,$nom,$formation,$somme,$avance,$reste,$date,$motif !== '' ? $motif : null,$bpf !== '' ? $bpf : null,$id]);
  } else {
    $stmt = $pdo->prepare("INSERT INTO finance_receipts (numero, etudiant_id, nom, formation, somme, avance, reste, date_recu, motif, bpf, created_by_admin_id) VALUES (?,?,?,?,?,?,?,?,?,?,?)");
    $stmt->execute([$numero,$etudId,$nom,$formation,$somme,$avance,$reste,$date,$motif !== '' ? $motif : null,$bpf !== '' ? $bpf : null,(int)($_SESSION['admin_id'] ?? 0)]);
    $id = (int)$pdo->lastInsertId();
  }

  // Sync as finance operation
  $libelle = ($motif !== '' ? $motif : 'Paiement') . ' — ' . $nom;
  $cat = $motif !== '' ? $motif : 'Scolarité';
  $q = $pdo->prepare("SELECT id FROM finance_operations WHERE piece_no = ? LIMIT 1");
  $q->execute([$numero]);
  $op = $q->fetch();
  if ($op) {
    $u = $pdo->prepare("UPDATE finance_operations SET type='Encaissement', categorie=?, libelle=?, montant=?, date_op=?, etudiant_id=? WHERE id=?");
    $u->execute([$cat,$libelle,$somme,$date,$etudId,(int)$op['id']]);
  } else {
    $i = $pdo->prepare("INSERT INTO finance_operations (type,categorie,libelle,piece_no,montant,date_op,etudiant_id,created_by_admin_id) VALUES ('Encaissement',?,?,?,?,?,?,?)");
    $i->execute([$cat,$libelle,$numero,$somme,$date,$etudId,(int)($_SESSION['admin_id'] ?? 0)]);
  }
  $pdo->commit();
  echo json_encode(['status'=>'success','id'=>$id]);
} catch (Throwable $e) {
  if ($pdo->inTransaction()) $pdo->rollBack();
  http_response_code(500); echo json_encode(['status'=>'error','message'=>'Erreur serveur.']);
}


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

  $stmt = $pdo->query("SELECT * FROM finance_receipts ORDER BY date_recu DESC, id DESC");
  $rows = $stmt->fetchAll();
  echo json_encode(['status'=>'success','data'=>$rows]);
} catch (Throwable $e) {
  http_response_code(500); echo json_encode(['status'=>'error','message'=>'Erreur serveur.']);
}


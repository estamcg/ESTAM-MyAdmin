<?php
declare(strict_types=1);

require_once __DIR__ . '/auth_required.php';
require_once __DIR__ . '/db_connect.php';

header('Content-Type: application/json; charset=utf-8');

try {
  $pdo->exec("CREATE TABLE IF NOT EXISTS `academic_diplomes` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `etudiant_id` INT UNSIGNED NOT NULL,
    `type_diplome` VARCHAR(120) NOT NULL,
    `mention` VARCHAR(80) NULL,
    `annee_academique` VARCHAR(32) NULL,
    `date_delivrance` DATE NOT NULL,
    `numero_piece` VARCHAR(64) NULL,
    `observations` TEXT NULL,
    `created_by_admin_id` INT UNSIGNED NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_diplome_etudiant` (`etudiant_id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

  $data = json_decode((string)file_get_contents('php://input'), true);
  if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Requête invalide.']);
    exit;
  }

  $id = (int)($data['id'] ?? 0);
  $etudiantId = (int)($data['etudiant_id'] ?? 0);
  $type = trim((string)($data['type_diplome'] ?? ''));
  $date = trim((string)($data['date_delivrance'] ?? ''));
  if ($etudiantId <= 0 || $type === '' || $date === '') {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Étudiant, type et date sont obligatoires.']);
    exit;
  }

  $mention = trim((string)($data['mention'] ?? ''));
  $annee = trim((string)($data['annee_academique'] ?? ''));
  $numero = trim((string)($data['numero_piece'] ?? ''));
  $obs = trim((string)($data['observations'] ?? ''));
  $adminId = (int)($_SESSION['admin_id'] ?? 0);

  if ($id > 0) {
    $stmt = $pdo->prepare("
      UPDATE academic_diplomes SET
        etudiant_id = ?, type_diplome = ?, mention = ?, annee_academique = ?,
        date_delivrance = ?, numero_piece = ?, observations = ?
      WHERE id = ?
    ");
    $stmt->execute([
      $etudiantId,
      $type,
      $mention !== '' ? $mention : null,
      $annee !== '' ? $annee : null,
      $date,
      $numero !== '' ? $numero : null,
      $obs !== '' ? $obs : null,
      $id,
    ]);
  } else {
    $stmt = $pdo->prepare("
      INSERT INTO academic_diplomes (
        etudiant_id, type_diplome, mention, annee_academique, date_delivrance, numero_piece, observations, created_by_admin_id
      ) VALUES (?,?,?,?,?,?,?,?)
    ");
    $stmt->execute([
      $etudiantId,
      $type,
      $mention !== '' ? $mention : null,
      $annee !== '' ? $annee : null,
      $date,
      $numero !== '' ? $numero : null,
      $obs !== '' ? $obs : null,
      $adminId ?: null,
    ]);
    $id = (int)$pdo->lastInsertId();
  }

  echo json_encode(['status' => 'success', 'id' => $id]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}

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
    KEY `idx_diplome_etudiant` (`etudiant_id`),
    KEY `idx_diplome_date` (`date_delivrance`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

  $stmt = $pdo->query("
    SELECT
      d.id,
      d.etudiant_id,
      d.type_diplome,
      d.mention,
      d.annee_academique,
      d.date_delivrance,
      d.numero_piece,
      d.observations,
      d.created_at,
      e.matricule,
      CONCAT(e.nom, ' ', e.prenom) AS nom_complet,
      e.niveau,
      f.acro AS filiere_acro
    FROM academic_diplomes d
    INNER JOIN etudiants e ON e.id = d.etudiant_id
    LEFT JOIN filiere f ON f.id = e.filiere_id
    ORDER BY d.date_delivrance DESC, d.id DESC
  ");
  echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll()]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}

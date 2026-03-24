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
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

  $data = json_decode((string)file_get_contents('php://input'), true);
  $id = (int)($data['id'] ?? 0);
  if ($id <= 0) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'ID invalide.']);
    exit;
  }
  $stmt = $pdo->prepare('DELETE FROM academic_diplomes WHERE id = ?');
  $stmt->execute([$id]);
  echo json_encode(['status' => 'success']);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}

<?php
declare(strict_types=1);

// Connexion PDO (XAMPP)
// Ajuste les identifiants selon ta config locale.

$DB_HOST = 'localhost';
$DB_NAME = 'estam_myadmin';
$DB_USER = 'root';
$DB_PASS = 'Hermellon@13';

$charset = 'utf8mb4';

$dsn = "mysql:host={$DB_HOST};dbname={$DB_NAME};charset={$charset}";

try {
  $pdo = new PDO(
    $dsn,
    $DB_USER,
    $DB_PASS,
    [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      PDO::ATTR_EMULATE_PREPARES => false,
    ]
  );
} catch (Throwable $e) {
  http_response_code(500);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode([
    'status' => 'error',
    'message' => 'Erreur connexion base de données.'
  ]);
  exit;
}


<?php
declare(strict_types=1);

require_once __DIR__ . '/auth_required.php';
require_once __DIR__ . '/db_connect.php';

header('Content-Type: application/json; charset=utf-8');

try {
  $adminId = (int)($_SESSION['admin_id'] ?? 0);
  if ($adminId <= 0) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Session invalide.']);
    exit;
  }

  $stmt = $pdo->prepare("
    SELECT
      a.id AS admin_id,
      a.username,
      a.display_name,
      a.role,
      p.genre, p.prenom, p.nom, p.email, p.tel, p.dob, p.adresse, p.ville, p.fonction, p.photo_data_url
    FROM admins a
    LEFT JOIN admin_profiles p ON p.admin_id = a.id
    WHERE a.id = ?
    LIMIT 1
  ");
  $stmt->execute([$adminId]);
  $row = $stmt->fetch();
  if (!$row) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Profil introuvable.']);
    exit;
  }

  if (empty($row['prenom']) && empty($row['nom'])) {
    $parts = preg_split('/\s+/', (string)$row['display_name']);
    $prenom = $parts[0] ?? 'Admin';
    $nom = trim(implode(' ', array_slice($parts, 1))) ?: 'ESTAM';
  } else {
    $prenom = (string)($row['prenom'] ?? '');
    $nom = (string)($row['nom'] ?? '');
  }

  echo json_encode([
    'status' => 'success',
    'data' => [
      'admin_id' => (int)$row['admin_id'],
      'username' => (string)$row['username'],
      'role' => (string)$row['role'],
      'genre' => (string)($row['genre'] ?? 'M'),
      'prenom' => $prenom,
      'nom' => $nom,
      'email' => (string)($row['email'] ?? ''),
      'tel' => (string)($row['tel'] ?? ''),
      'dob' => (string)($row['dob'] ?? ''),
      'adresse' => (string)($row['adresse'] ?? ''),
      'ville' => (string)($row['ville'] ?? 'Brazzaville'),
      'fonction' => (string)($row['fonction'] ?? $row['role']),
      'photo_data_url' => (string)($row['photo_data_url'] ?? ''),
    ]
  ]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}


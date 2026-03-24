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

  $data = json_decode((string)file_get_contents('php://input'), true);
  if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Requête invalide.']);
    exit;
  }

  $genre = trim((string)($data['genre'] ?? 'M')) === 'F' ? 'F' : 'M';
  $prenom = trim((string)($data['prenom'] ?? ''));
  $nom = trim((string)($data['nom'] ?? ''));
  $email = trim((string)($data['email'] ?? ''));
  if ($prenom === '' || $nom === '') {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Prénom et nom sont obligatoires.']);
    exit;
  }

  $displayName = trim($prenom . ' ' . $nom);
  $role = (string)($_SESSION['admin_role'] ?? 'Super Admin');

  $pdo->beginTransaction();

  $stmt = $pdo->prepare("UPDATE admins SET display_name = ? WHERE id = ?");
  $stmt->execute([$displayName, $adminId]);

  $stmt = $pdo->prepare("
    INSERT INTO admin_profiles (admin_id, genre, prenom, nom, email, tel, dob, adresse, ville, fonction, photo_data_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      genre = VALUES(genre),
      prenom = VALUES(prenom),
      nom = VALUES(nom),
      email = VALUES(email),
      tel = VALUES(tel),
      dob = VALUES(dob),
      adresse = VALUES(adresse),
      ville = VALUES(ville),
      fonction = VALUES(fonction),
      photo_data_url = VALUES(photo_data_url)
  ");
  $stmt->execute([
    $adminId,
    $genre,
    $prenom,
    $nom,
    $email,
    trim((string)($data['tel'] ?? '')),
    trim((string)($data['dob'] ?? '')) !== '' ? trim((string)$data['dob']) : null,
    trim((string)($data['adresse'] ?? '')),
    trim((string)($data['ville'] ?? '')),
    trim((string)($data['fonction'] ?? $role)),
    (string)($data['photo_data_url'] ?? '')
  ]);

  $pdo->commit();

  $_SESSION['admin_display_name'] = $displayName;

  echo json_encode([
    'status' => 'success',
    'message' => 'Profil mis à jour.',
    'data' => [
      'display_name' => $displayName,
      'role' => $role
    ]
  ]);
} catch (Throwable $e) {
  if ($pdo->inTransaction()) {
    $pdo->rollBack();
  }
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}


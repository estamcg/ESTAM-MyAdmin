<?php
declare(strict_types=1);

require_once __DIR__ . '/security_headers.php';
require_once __DIR__ . '/db_connect.php';

header('Content-Type: application/json; charset=utf-8');

try {
  $data = json_decode((string)file_get_contents('php://input'), true);
  if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Requete invalide.']);
    exit;
  }

  $username = trim((string)($data['username'] ?? ''));
  $newPassword = (string)($data['new_password'] ?? '');
  $confirm = (string)($data['confirm_password'] ?? '');

  if ($username === '' || $newPassword === '' || $confirm === '') {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Tous les champs sont obligatoires.']);
    exit;
  }
  if ($newPassword !== $confirm) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Les mots de passe ne correspondent pas.']);
    exit;
  }
  if (strlen($newPassword) < 8) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Le mot de passe doit contenir au moins 8 caracteres.']);
    exit;
  }

  $stmt = $pdo->prepare("SELECT id FROM admins WHERE username = ? LIMIT 1");
  $stmt->execute([$username]);
  $row = $stmt->fetch();
  if (!$row) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Matricule/identifiant introuvable.']);
    exit;
  }

  $hash = password_hash($newPassword, PASSWORD_BCRYPT);
  $upd = $pdo->prepare("UPDATE admins SET pwd_hash = ? WHERE id = ?");
  $upd->execute([$hash, (int)$row['id']]);

  echo json_encode(['status' => 'success', 'message' => 'Mot de passe reinitialise avec succes.']);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}


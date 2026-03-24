<?php
declare(strict_types=1);

require_once __DIR__ . '/auth_required.php';
require_once __DIR__ . '/db_connect.php';

header('Content-Type: application/json; charset=utf-8');

try {
  $adminId = (int)($_SESSION['admin_id'] ?? 0);
  $data = json_decode((string)file_get_contents('php://input'), true);
  if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Requête invalide.']);
    exit;
  }
  $current = (string)($data['current_password'] ?? '');
  $new = (string)($data['new_password'] ?? '');
  $confirm = (string)($data['confirm_password'] ?? '');
  if ($current === '' || $new === '' || $confirm === '') {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Tous les champs sont obligatoires.']);
    exit;
  }
  if ($new !== $confirm) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Confirmation incorrecte.']);
    exit;
  }
  if (strlen($new) < 8) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Le mot de passe doit contenir au moins 8 caractères.']);
    exit;
  }

  $stmt = $pdo->prepare("SELECT pwd_hash FROM admins WHERE id=? LIMIT 1");
  $stmt->execute([$adminId]);
  $row = $stmt->fetch();
  if (!$row || !password_verify($current, (string)$row['pwd_hash'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Mot de passe actuel incorrect.']);
    exit;
  }

  $stmt = $pdo->prepare("UPDATE admins SET pwd_hash=? WHERE id=?");
  $stmt->execute([password_hash($new, PASSWORD_BCRYPT), $adminId]);

  echo json_encode(['status' => 'success', 'message' => 'Mot de passe mis à jour.']);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}


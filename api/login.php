<?php
declare(strict_types=1);

require_once __DIR__ . '/security_headers.php';
header('Content-Type: application/json; charset=utf-8');
if (session_status() === PHP_SESSION_NONE) {
  ini_set('session.use_strict_mode', '1');
  ini_set('session.cookie_httponly', '1');
  ini_set('session.cookie_samesite', 'Lax');
  if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
    ini_set('session.cookie_secure', '1');
  }
  session_start();
}

require_once __DIR__ . '/db_connect.php';

function respond(string $status, string $message, int $code = 200, array $extra = []): void {
  http_response_code($code);
  echo json_encode(array_merge([
    'status' => $status,
    'message' => $message,
  ], $extra));
  exit;
}

try {
  $raw = file_get_contents('php://input') ?: '';
  $data = json_decode($raw, true);

  if (!is_array($data)) {
    respond('error', 'Requête invalide.', 400);
  }

  $username = trim((string)($data['username'] ?? ''));
  $password = (string)($data['password'] ?? '');

  if ($username === '' || $password === '') {
    respond('error', 'Identifiant et mot de passe requis.', 400);
  }

  // Bootstrap admin si absent (pour lancer rapidement le projet)
  $bootstrapUser = 'admin';
  $bootstrapPass = 'estam2025';
  $stmt = $pdo->prepare("SELECT id FROM admins WHERE username = ? LIMIT 1");
  $stmt->execute([$bootstrapUser]);
  $exists = $stmt->fetch();
  if (!$exists) {
    $stmtIns = $pdo->prepare("INSERT INTO admins (username, display_name, role, pwd_hash) VALUES (?, ?, ?, ?)");
    $stmtIns->execute([
      $bootstrapUser,
      'Admin ESTAM',
      'Super Admin',
      password_hash($bootstrapPass, PASSWORD_BCRYPT)
    ]);
  }

  $stmt = $pdo->prepare("SELECT id, username, display_name, role, pwd_hash FROM admins WHERE username = ? LIMIT 1");
  $stmt->execute([$username]);
  $admin = $stmt->fetch();

  if (!$admin) {
    respond('error', 'Identifiants incorrects.', 401);
  }

  $ok = password_verify($password, (string)$admin['pwd_hash']);
  if (!$ok) {
    respond('error', 'Identifiants incorrects.', 401);
  }

  $_SESSION['admin_id'] = (int)$admin['id'];
  $_SESSION['admin_username'] = (string)$admin['username'];
  $_SESSION['admin_display_name'] = (string)$admin['display_name'];
  $_SESSION['admin_role'] = (string)$admin['role'];

  respond('success', 'Connexion réussie.', 200, [
    'admin' => [
      'id' => (int)$admin['id'],
      'username' => (string)$admin['username'],
      'display_name' => (string)$admin['display_name'],
      'role' => (string)$admin['role'],
    ]
  ]);
} catch (Throwable $e) {
  respond('error', 'Erreur serveur.', 500);
}


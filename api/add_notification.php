<?php
declare(strict_types=1);

require_once __DIR__ . '/auth_required.php';
require_once __DIR__ . '/db_connect.php';

header('Content-Type: application/json; charset=utf-8');

try {
  $sessionAdminId = (int)($_SESSION['admin_id'] ?? 0);
  $sessionRoleRaw = trim((string)($_SESSION['admin_role'] ?? ''));
  $roleNorm = mb_strtolower($sessionRoleRaw);
  $isSuperAdmin = str_contains($roleNorm, 'super');
  $isAdmin = $isSuperAdmin || str_contains($roleNorm, 'admin');
  $isFormateur = str_contains($roleNorm, 'formateur');
  $isPartenaire = str_contains($roleNorm, 'partenaire');

  $data = json_decode((string)file_get_contents('php://input'), true);
  if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Requête invalide.']);
    exit;
  }

  $titre = trim((string)($data['titre'] ?? ''));
  $message = trim((string)($data['message'] ?? ''));
  if ($titre === '' || $message === '') {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Titre et message obligatoires.']);
    exit;
  }

  $type = trim((string)($data['type'] ?? 'annonce'));
  $priorite = trim((string)($data['priorite'] ?? 'normale'));
  $destinataires = $data['destinataires'] ?? [];
  if (!is_array($destinataires)) $destinataires = [];
  $scheduledFor = trim((string)($data['scheduled_for'] ?? ''));

  // Permissions fines par role pour les annonces
  if (!$isAdmin) {
    if (!$isFormateur && !$isPartenaire) {
      http_response_code(403);
      echo json_encode(['status' => 'error', 'message' => 'Role non autorise a publier des annonces.']);
      exit;
    }
    if ($type !== 'annonce') {
      http_response_code(403);
      echo json_encode(['status' => 'error', 'message' => 'Ce role peut publier uniquement des annonces.']);
      exit;
    }
    if ($priorite !== 'normale') {
      http_response_code(403);
      echo json_encode(['status' => 'error', 'message' => 'Priorite reservee aux administrateurs.']);
      exit;
    }
    if ($scheduledFor !== '') {
      http_response_code(403);
      echo json_encode(['status' => 'error', 'message' => 'Planification reservee aux administrateurs.']);
      exit;
    }
    // Formateur/Partenaire: cible etudiants uniquement
    $allowed = ['Étudiants', 'Etudiants'];
    $destinataires = array_values(array_filter(array_map('strval', $destinataires), static fn($d) => in_array($d, $allowed, true)));
    if (!$destinataires) {
      $destinataires = ['Étudiants'];
    }
  }

  $scheduledFor = trim((string)($data['scheduled_for'] ?? ''));
  $sent = $scheduledFor === '' ? 1 : 0;
  $sentAt = $scheduledFor === '' ? date('Y-m-d H:i:s') : null;

  $stmt = $pdo->prepare("
    INSERT INTO notifications (
      type, priorite, titre, message, destinataires_json, filiere, auto_generated,
      scheduled_for, sent, sent_at, is_read, created_by_admin_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
  ");
  $stmt->execute([
    $type,
    $priorite,
    $titre,
    $message,
    json_encode($destinataires, JSON_UNESCAPED_UNICODE),
    trim((string)($data['filiere'] ?? '')),
    !empty($data['auto_generated']) ? 1 : 0,
    $scheduledFor !== '' ? $scheduledFor : null,
    $sent,
    $sentAt,
    $sessionAdminId,
  ]);

  echo json_encode(['status' => 'success', 'id' => (int)$pdo->lastInsertId()]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}


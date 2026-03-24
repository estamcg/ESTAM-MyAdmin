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

  $section = trim((string)($data['section'] ?? ''));
  if (!in_array($section, ['etablissement', 'academique', 'notifications'], true)) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Section invalide.']);
    exit;
  }

  if ($section === 'etablissement') {
    $stmt = $pdo->prepare("
      UPDATE app_settings
      SET etablissement_nom=?, agrement_creation=?, agrement_ouverture=?, email_officiel=?, telephone_officiel=?,
          adresses_json=?, updated_by_admin_id=?
      WHERE id=1
    ");
    $stmt->execute([
      trim((string)($data['etablissement_nom'] ?? '')),
      trim((string)($data['agrement_creation'] ?? '')),
      trim((string)($data['agrement_ouverture'] ?? '')),
      trim((string)($data['email_officiel'] ?? '')),
      trim((string)($data['telephone_officiel'] ?? '')),
      json_encode($data['adresses'] ?? [], JSON_UNESCAPED_UNICODE),
      $adminId
    ]);
  } elseif ($section === 'academique') {
    $stmt = $pdo->prepare("
      UPDATE app_settings
      SET annee_academique=?, semestre_actif=?, updated_by_admin_id=?
      WHERE id=1
    ");
    $stmt->execute([
      trim((string)($data['annee_academique'] ?? '')),
      trim((string)($data['semestre_actif'] ?? '')),
      $adminId
    ]);
  } else {
    $stmt = $pdo->prepare("
      UPDATE app_settings
      SET notif_alertes_paiement=?, notif_nouvelles_inscriptions=?, notif_rapports_hebdo=?, notif_alertes_systeme=?,
          updated_by_admin_id=?
      WHERE id=1
    ");
    $stmt->execute([
      !empty($data['notif_alertes_paiement']) ? 1 : 0,
      !empty($data['notif_nouvelles_inscriptions']) ? 1 : 0,
      !empty($data['notif_rapports_hebdo']) ? 1 : 0,
      !empty($data['notif_alertes_systeme']) ? 1 : 0,
      $adminId
    ]);
  }

  echo json_encode(['status' => 'success', 'message' => 'Paramètres mis à jour.']);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}


<?php
declare(strict_types=1);

require_once __DIR__ . '/auth_required.php';
require_once __DIR__ . '/db_connect.php';

header('Content-Type: application/json; charset=utf-8');

try {
  $stmt = $pdo->query("SELECT * FROM app_settings WHERE id = 1 LIMIT 1");
  $row = $stmt->fetch();
  if (!$row) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Paramètres introuvables.']);
    exit;
  }

  $addresses = [];
  if (!empty($row['adresses_json'])) {
    $addresses = json_decode((string)$row['adresses_json'], true);
    if (!is_array($addresses)) $addresses = [];
  }

  echo json_encode([
    'status' => 'success',
    'data' => [
      'etablissement_nom' => (string)$row['etablissement_nom'],
      'agrement_creation' => (string)($row['agrement_creation'] ?? ''),
      'agrement_ouverture' => (string)($row['agrement_ouverture'] ?? ''),
      'email_officiel' => (string)($row['email_officiel'] ?? ''),
      'telephone_officiel' => (string)($row['telephone_officiel'] ?? ''),
      'adresses' => $addresses,
      'annee_academique' => (string)($row['annee_academique'] ?? ''),
      'semestre_actif' => (string)($row['semestre_actif'] ?? ''),
      'notif_alertes_paiement' => (int)$row['notif_alertes_paiement'] === 1,
      'notif_nouvelles_inscriptions' => (int)$row['notif_nouvelles_inscriptions'] === 1,
      'notif_rapports_hebdo' => (int)$row['notif_rapports_hebdo'] === 1,
      'notif_alertes_systeme' => (int)$row['notif_alertes_systeme'] === 1,
    ]
  ]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}


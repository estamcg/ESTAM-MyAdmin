<?php
declare(strict_types=1);

require_once __DIR__ . '/auth_required.php';
require_once __DIR__ . '/db_connect.php';

header('Content-Type: application/json; charset=utf-8');

try {
  $data = json_decode((string)file_get_contents('php://input'), true);
  if (!is_array($data)) { http_response_code(400); echo json_encode(['status'=>'error','message'=>'Requête invalide.']); exit; }

  $id = (int)($data['id'] ?? 0);
  $nom = trim((string)($data['nom'] ?? ''));
  $prenom = trim((string)($data['prenom'] ?? ''));
  $type = trim((string)($data['type'] ?? ''));
  if ($id <= 0 || $nom === '' || $prenom === '' || !in_array($type, ['Administration','Formateur','Partenaire'], true)) {
    http_response_code(422); echo json_encode(['status'=>'error','message'=>'Champs obligatoires invalides.']); exit;
  }

  $stmt = $pdo->prepare("
    UPDATE personnel SET
      type=?, fonction=?, statut=?, nom=?, prenom=?, email=?, tel=?, nationalite=?, naissance=?, embauche=?,
      secteur_key=?, filiere_acros=?, niveaux=?, matieres=?, grade=?, specialisation=?, notes=?, photo_data_url=?
    WHERE id=?
  ");
  $stmt->execute([
    $type,
    trim((string)($data['fonction'] ?? '')),
    trim((string)($data['statut'] ?? 'Actif')) === 'Inactif' ? 'Inactif' : 'Actif',
    mb_strtoupper($nom),
    $prenom,
    trim((string)($data['email'] ?? '')),
    trim((string)($data['tel'] ?? '')),
    trim((string)($data['nationalite'] ?? '')),
    trim((string)($data['naissance'] ?? '')) !== '' ? trim((string)$data['naissance']) : null,
    trim((string)($data['embauche'] ?? '')) !== '' ? trim((string)$data['embauche']) : null,
    trim((string)($data['secteur_key'] ?? '')),
    json_encode($data['filiere_acros'] ?? [], JSON_UNESCAPED_UNICODE),
    json_encode($data['niveaux'] ?? [], JSON_UNESCAPED_UNICODE),
    trim((string)($data['matieres'] ?? '')),
    trim((string)($data['grade'] ?? '')),
    trim((string)($data['specialisation'] ?? '')),
    trim((string)($data['notes'] ?? '')),
    (string)($data['photo_data_url'] ?? ''),
    $id
  ]);

  echo json_encode(['status' => 'success']);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}


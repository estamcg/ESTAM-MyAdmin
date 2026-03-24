<?php
declare(strict_types=1);

// Alias de compatibilité (ancien endpoint).
// Remplace l'ancien schéma `students` par `etudiants`.

header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/auth_required.php';
require_once __DIR__ . '/db_connect.php';

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) {
  http_response_code(400);
  echo json_encode(['status' => 'error', 'message' => 'Requête invalide.']);
  exit;
}

$matricule = trim((string)($data['matricule'] ?? ''));
$nom = trim((string)($data['nom'] ?? ''));
$prenom = trim((string)($data['prenom'] ?? ''));
$filiere = trim((string)($data['filiere'] ?? ''));
$niveau = trim((string)($data['niveau'] ?? 'L2'));

if ($matricule === '' || $nom === '' || $prenom === '' || $filiere === '') {
  http_response_code(422);
  echo json_encode(['status' => 'error', 'message' => 'Champs requis : matricule, nom, prenom, filiere (acro ou label).']);
  exit;
}

// Resolve filière : match acro exact sinon label partiel
$stmt = $pdo->prepare("SELECT id, secteur_key FROM filiere WHERE acro = ? LIMIT 1");
$stmt->execute([$filiere]);
$f = $stmt->fetch();
if (!$f) {
  $stmt = $pdo->prepare("SELECT id, secteur_key FROM filiere WHERE label LIKE ? LIMIT 1");
  $stmt->execute(['%'.$filiere.'%']);
  $f = $stmt->fetch();
}
if (!$f) {
  http_response_code(404);
  echo json_encode(['status' => 'error', 'message' => 'Filière introuvable.']);
  exit;
}

$stmt = $pdo->prepare("
  INSERT INTO etudiants (
    matricule, dossier, nom, prenom, secteur_key, filiere_id, niveau,
    statut, anciennete, mode_paiement
  ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Actif', 'Nouveau', 'Espèces')
");

$ok = $stmt->execute([
  $matricule,
  null,
  $nom,
  $prenom,
  (string)$f['secteur_key'],
  (int)$f['id'],
  $niveau
]);

if (!$ok) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur lors de l\'insertion.']);
  exit;
}

echo json_encode(['status' => 'success', 'message' => 'Étudiant ajouté (alias).', 'id' => (int)$pdo->lastInsertId()]);
?>
<?php
declare(strict_types=1);

require_once __DIR__ . '/auth_required.php';
require_once __DIR__ . '/db_connect.php';

header('Content-Type: application/json; charset=utf-8');

function respond(string $status, string $message, int $code, array $extra = []): void {
  http_response_code($code);
  echo json_encode(array_merge([
    'status' => $status,
    'message' => $message,
  ], $extra));
  exit;
}

function toDateOrNull($v): ?string {
  if ($v === null) return null;
  $s = trim((string)$v);
  if ($s === '') return null;
  $t = strtotime($s);
  if ($t === false) return null;
  return date('Y-m-d', $t);
}

try {
  $raw = file_get_contents('php://input') ?: '';
  $data = json_decode($raw, true);
  if (!is_array($data)) respond('error', 'Requête invalide.', 400);

  // Récupération des données du formulaire
  $matricule = trim((string)($data['matricule'] ?? ''));
  $nom = trim((string)($data['nom'] ?? ''));
  $prenom = trim((string)($data['prenom'] ?? ''));
  $secteurKey = trim((string)($data['secteur_key'] ?? ''));
  $filiereAcro = trim((string)($data['filiere_acro'] ?? ''));
  $niveau = trim((string)($data['niveau'] ?? ''));
  
  // Champs optionnels
  $dossier = trim((string)($data['dossier'] ?? ''));
  $dateInscription = toDateOrNull($data['date_inscription'] ?? null);
  $naissance = toDateOrNull($data['naissance'] ?? null);
  $lieuNaissance = trim((string)($data['lieu_naissance'] ?? ''));
  $adresse = trim((string)($data['adresse'] ?? ''));
  $ville = trim((string)($data['ville'] ?? ''));
  $arrondissement = trim((string)($data['arrondissement'] ?? ($data['arr'] ?? '')));
  
  $tel1 = trim((string)($data['tel1'] ?? ($data['tel'] ?? '')));
  $tel2 = trim((string)($data['tel2'] ?? ''));
  $whatsapp = trim((string)($data['whatsapp'] ?? ''));
  $email = trim((string)($data['email'] ?? ''));
  
  $tuteurNom = trim((string)($data['tuteur_nom'] ?? ($data['tuteurNom'] ?? '')));
  $tuteurProfession = trim((string)($data['tuteur_profession'] ?? ($data['tuteurProfession'] ?? '')));
  $tuteurTel1 = trim((string)($data['tuteur_tel1'] ?? ($data['tuteurTel1'] ?? '')));
  $tuteurTel2 = trim((string)($data['tuteur_tel2'] ?? ($data['tuteurTel2'] ?? '')));
  
  $fraisInscription = (float)($data['frais_inscription'] ?? ($data['fraisInscription'] ?? 0));
  $fraisCarte = (float)($data['frais_carte'] ?? ($data['fraisCarte'] ?? 0));
  $fraisMois = (float)($data['frais_mois'] ?? ($data['fraisMois'] ?? 0));
  $fraisExtra = (float)($data['frais_extra'] ?? ($data['fraisExtra'] ?? 0));
  
  $modePaiement = trim((string)($data['mode_paiement'] ?? ($data['modePaiement'] ?? 'Espèces')));
  $statut = trim((string)($data['statut'] ?? 'Actif'));
  $anciennete = trim((string)($data['anciennete'] ?? 'Nouveau'));
  
  $photoDataUrl = $data['photo_data_url'] ?? ($data['photo'] ?? null);
  
  // Validation des champs obligatoires
  if ($matricule === '' || $nom === '' || $prenom === '' || $secteurKey === '' || $niveau === '') {
    respond('error', 'Champs requis : matricule, nom, prenom, secteur_key, niveau.', 422);
  }
  if ($filiereAcro === '') {
    respond('error', 'Champ requis : filiere_acro.', 422);
  }
  
  // Résolution de filiere_id à partir de l'acronyme
  $stmt = $pdo->prepare("SELECT id FROM filiere WHERE acro = ? LIMIT 1");
  $stmt->execute([$filiereAcro]);
  $f = $stmt->fetch();
  if (!$f) {
    respond('error', 'Filière introuvable pour l\'acronyme: ' . $filiereAcro, 404);
  }
  $filiereId = (int)$f['id'];
  
  // Vérification des doublons de matricule
  $stmt = $pdo->prepare("SELECT id FROM etudiants WHERE matricule = ? LIMIT 1");
  $stmt->execute([$matricule]);
  if ($stmt->fetch()) {
    respond('error', 'Un étudiant avec ce matricule existe déjà.', 409);
  }
  
  // Insertion
  $sql = "
    INSERT INTO etudiants (
      matricule, dossier, nom, prenom, secteur_key, filiere_id, niveau,
      date_inscription, naissance, lieu_naissance, adresse, ville, arrondissement,
      tel1, tel2, whatsapp, email,
      tuteur_nom, tuteur_profession, tuteur_tel1, tuteur_tel2,
      frais_inscription, frais_carte, frais_mois, frais_extra,
      mode_paiement, statut, anciennete, photo_data_url
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?
    )
  ";
  
  $stmt = $pdo->prepare($sql);
  $stmt->execute([
    $matricule,
    $dossier !== '' ? $dossier : null,
    $nom,
    $prenom,
    $secteurKey,
    $filiereId,
    $niveau,
    $dateInscription,
    $naissance,
    $lieuNaissance !== '' ? $lieuNaissance : null,
    $adresse !== '' ? $adresse : null,
    $ville !== '' ? $ville : null,
    $arrondissement !== '' ? $arrondissement : null,
    $tel1 !== '' ? $tel1 : null,
    $tel2 !== '' ? $tel2 : null,
    $whatsapp !== '' ? $whatsapp : null,
    $email !== '' ? $email : null,
    $tuteurNom !== '' ? $tuteurNom : null,
    $tuteurProfession !== '' ? $tuteurProfession : null,
    $tuteurTel1 !== '' ? $tuteurTel1 : null,
    $tuteurTel2 !== '' ? $tuteurTel2 : null,
    $fraisInscription,
    $fraisCarte,
    $fraisMois,
    $fraisExtra,
    $modePaiement !== '' ? $modePaiement : 'Espèces',
    $statut !== '' ? $statut : 'Actif',
    $anciennete !== '' ? $anciennete : 'Nouveau',
    ($photoDataUrl !== null && $photoDataUrl !== '') ? $photoDataUrl : null
  ]);
  
  $newId = (int)$pdo->lastInsertId();
  
  respond('success', 'Étudiant ajouté avec succès.', 201, ['id' => $newId]);
  
} catch (PDOException $e) {
  // Gestion des erreurs PDO (doublon, etc.)
  if ($e->getCode() == 23000) {
    respond('error', 'Un étudiant avec ce matricule existe déjà.', 409);
  }
  respond('error', 'Erreur base de données.', 500);
} catch (Throwable $e) {
  respond('error', 'Erreur serveur: ' . $e->getMessage(), 500);
}
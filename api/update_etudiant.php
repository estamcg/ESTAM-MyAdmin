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

  $id = $data['id'] ?? null;
  if (!is_numeric($id)) respond('error', 'ID étudiant invalide.', 422);
  $id = (int)$id;

  // Required fields (for this CRUD stage)
  $matricule = trim((string)($data['matricule'] ?? ''));
  $niveau = trim((string)($data['niveau'] ?? ''));
  $nom = trim((string)($data['nom'] ?? ''));
  $prenom = trim((string)($data['prenom'] ?? ''));
  if ($prenom === '' && $nom !== '' && str_contains($nom, ' ')) {
    $parts = preg_split('/\s+/', $nom);
    $nom = (string)($parts[0] ?? '');
    $prenom = trim(implode(' ', array_slice($parts, 1)));
  }

  $secteurKey = trim((string)($data['secteur_key'] ?? ''));
  $filiereId = $data['filiere_id'] ?? null;
  $filiereAcro = trim((string)($data['filiere_acro'] ?? ''));

  if ($matricule === '' || $niveau === '' || $nom === '' || $prenom === '' || $secteurKey === '') {
    respond('error', 'Champs requis : matricule, nom, prenom, secteur_key, niveau.', 422);
  }
  if ($filiereId === null && $filiereAcro === '') {
    respond('error', 'Champs requis : filiere_id ou filiere_acro.', 422);
  }

  if ($filiereId === null || !is_numeric($filiereId)) {
    $stmt = $pdo->prepare("SELECT id FROM filiere WHERE acro = ? LIMIT 1");
    $stmt->execute([$filiereAcro]);
    $f = $stmt->fetch();
    if (!$f) respond('error', 'Filière introuvable (acro).', 404);
    $filiereId = (int)$f['id'];
  } else {
    $filiereId = (int)$filiereId;
  }

  $dossier = trim((string)($data['dossier'] ?? ''));
  $dateInscription = toDateOrNull($data['date_inscription'] ?? ($data['dateInscription'] ?? null));
  $naissance = toDateOrNull($data['naissance'] ?? null);
  $lieuNaissance = trim((string)($data['lieu_naissance'] ?? ($data['lieuNaissance'] ?? '')));
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
  if ($fraisInscription < 0 || $fraisCarte < 0 || $fraisMois < 0 || $fraisExtra < 0) {
    respond('error', 'Frais ne peuvent pas être négatifs.', 422);
  }

  $modePaiement = trim((string)($data['mode_paiement'] ?? ($data['modePaiement'] ?? 'Espèces')));
  $statut = trim((string)($data['statut'] ?? 'Actif'));
  $anciennete = trim((string)($data['anciennete'] ?? 'Nouveau'));

  $photoDataUrl = $data['photo_data_url'] ?? ($data['photo'] ?? null);
  if ($photoDataUrl !== null) {
    $photoDataUrl = (string)$photoDataUrl;
    if ($photoDataUrl !== '' && strlen($photoDataUrl) > 5_000_000) {
      respond('error', 'Photo trop volumineuse.', 413);
    }
  }

  $sql = "
    UPDATE etudiants SET
      matricule = ?,
      dossier = ?,
      nom = ?,
      prenom = ?,
      secteur_key = ?,
      filiere_id = ?,
      niveau = ?,
      date_inscription = ?,
      naissance = ?,
      lieu_naissance = ?,
      adresse = ?,
      ville = ?,
      arrondissement = ?,
      tel1 = ?,
      tel2 = ?,
      whatsapp = ?,
      email = ?,
      tuteur_nom = ?,
      tuteur_profession = ?,
      tuteur_tel1 = ?,
      tuteur_tel2 = ?,
      frais_inscription = ?,
      frais_carte = ?,
      frais_mois = ?,
      frais_extra = ?,
      mode_paiement = ?,
      statut = ?,
      anciennete = ?,
      photo_data_url = ?
    WHERE id = ?
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
    ($photoDataUrl !== null && $photoDataUrl !== '') ? $photoDataUrl : null,
    $id
  ]);

  if ($stmt->rowCount() === 0) {
    respond('error', 'Aucune mise à jour (ID introuvable).', 404);
  }

  respond('success', 'Étudiant mis à jour.', 200);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.', 'debug' => $e->getMessage()]);
}


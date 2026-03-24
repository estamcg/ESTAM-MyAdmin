<?php
declare(strict_types=1);

require_once __DIR__ . '/auth_required.php';
require_once __DIR__ . '/db_connect.php';

header('Content-Type: application/json; charset=utf-8');

try {
  $q = trim((string)($_GET['q'] ?? ''));
  $filiereId = $_GET['filiere_id'] ?? '';
  $statut = trim((string)($_GET['statut'] ?? ''));
  $niveau = trim((string)($_GET['niveau'] ?? ''));

  $page = (int)($_GET['page'] ?? 1);
  $limit = (int)($_GET['limit'] ?? 20);
  if ($page < 1) $page = 1;
  if ($limit < 1) $limit = 20;
  if ($limit > 8000) $limit = 8000;
  $offset = ($page - 1) * $limit;

  $sort = (string)($_GET['sort'] ?? 'nom');
  $order = strtolower((string)($_GET['order'] ?? 'asc')) === 'desc' ? 'DESC' : 'ASC';

  $allowedSort = [
    'nom' => 'nom',
    'prenom' => 'prenom',
    'matricule' => 'matricule',
    'niveau' => 'niveau',
    'statut' => 'statut',
    'date_inscription' => 'date_inscription',
    'updated_at' => 'updated_at',
    'frais_mois' => 'frais_mois',
  ];
  $sortCol = $allowedSort[$sort] ?? 'nom';

  $where = [];
  $params = [];

  if ($filiereId !== '' && is_numeric($filiereId)) {
    $where[] = 'e.filiere_id = ?';
    $params[] = (int)$filiereId;
  }
  if ($statut !== '') {
    $where[] = 'e.statut = ?';
    $params[] = $statut;
  }
  if ($niveau !== '') {
    $where[] = 'e.niveau = ?';
    $params[] = $niveau;
  }

  if ($q !== '') {
    $where[] = '(
      e.matricule LIKE ?
      OR e.dossier LIKE ?
      OR e.nom LIKE ?
      OR e.prenom LIKE ?
      OR e.email LIKE ?
      OR e.tel1 LIKE ?
    )';
    $like = '%'.$q.'%';
    $params[] = $like; // matricule
    $params[] = $like; // dossier
    $params[] = $like; // nom
    $params[] = $like; // prenom
    $params[] = $like; // email
    $params[] = $like; // tel1
  }

  $whereSql = $where ? ('WHERE '.implode(' AND ', $where)) : '';

  $countSql = "SELECT COUNT(*) FROM etudiants e {$whereSql}";
  $stmt = $pdo->prepare($countSql);
  $stmt->execute($params);
  $total = (int)$stmt->fetchColumn();

  $sql = "
    SELECT
      e.id,
      e.matricule,
      e.dossier,
      e.nom,
      e.prenom,
      e.secteur_key,
      e.niveau,
      e.date_inscription,
      e.naissance,
      e.lieu_naissance,
      e.ville,
      e.arrondissement,
      e.tel1,
      e.tel2,
      e.whatsapp,
      e.email,
      e.tuteur_nom,
      e.tuteur_profession,
      e.tuteur_tel1,
      e.tuteur_tel2,
      e.frais_inscription,
      e.frais_carte,
      e.frais_mois,
      e.frais_extra,
      e.mode_paiement,
      e.statut,
      e.anciennete,
      e.photo_data_url,
      e.created_at,
      e.updated_at,
      f.acro AS filiere_acro,
      f.label AS filiere_label,
      f.secteur_key AS filiere_secteur_key
    FROM etudiants e
  
LEFT JOIN filiere f ON f.id = e.filiere_id
    {$whereSql}
    ORDER BY e.{$sortCol} {$order}, e.id DESC
    LIMIT ? OFFSET ?
  ";

  $stmt = $pdo->prepare($sql);
  $params2 = array_merge($params, [$limit, $offset]);
  $stmt->execute($params2);
  $rows = $stmt->fetchAll();

  echo json_encode([
    'status' => 'success',
    'data' => $rows,
    'meta' => [
      'total' => $total,
      'page' => $page,
      'limit' => $limit
    ]
  ]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}


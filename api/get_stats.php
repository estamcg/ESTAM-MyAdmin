<?php
declare(strict_types=1);

require_once __DIR__ . '/auth_required.php';
require_once __DIR__ . '/db_connect.php';

header('Content-Type: application/json; charset=utf-8');

try {
  $tableExistsStmt = $pdo->prepare("
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = DATABASE() AND table_name = ?
    LIMIT 1
  ");
  $tableExists = function (string $name) use ($tableExistsStmt): bool {
    $tableExistsStmt->execute([$name]);
    return (bool)$tableExistsStmt->fetchColumn();
  };

  // Counts
  $etudiants = (int)$pdo->query("SELECT COUNT(*) FROM etudiants")->fetchColumn();
  $filieres = (int)$pdo->query("SELECT COUNT(*) FROM filiere")->fetchColumn();

  // Personnel
  $personnel = 0;
  if ($tableExists('personnel')) {
    $personnel = (int)$pdo->query("SELECT COUNT(*) FROM personnel WHERE statut = 'Actif'")->fetchColumn();
  }

  // Finance sums (preferred source)
  $fin = [
    'total_encaissements' => 0.0,
    'total_decaissements' => 0.0,
    'solde' => 0.0,
    'ops' => 0,
  ];
  if ($tableExists('finance_operations')) {
    $row = $pdo->query("
      SELECT
        COALESCE(SUM(CASE WHEN type='Encaissement' THEN montant ELSE 0 END),0) AS total_encaissements,
        COALESCE(SUM(CASE WHEN type='Décaissement' THEN montant ELSE 0 END),0) AS total_decaissements,
        COUNT(*) AS ops
      FROM finance_operations
    ")->fetch();
    $fin['total_encaissements'] = (float)($row['total_encaissements'] ?? 0);
    $fin['total_decaissements'] = (float)($row['total_decaissements'] ?? 0);
    $fin['ops'] = (int)($row['ops'] ?? 0);
    $fin['solde'] = $fin['total_encaissements'] - $fin['total_decaissements'];
  }

  // Sums from etudiants fees (used for breakdown & fallback)
  $row = $pdo->query("
    SELECT
      COALESCE(SUM(frais_inscription),0) AS total_inscriptions,
      COALESCE(SUM(frais_mois),0)        AS total_scolarite,
      COALESCE(SUM(frais_carte),0)       AS total_cartes,
      COALESCE(SUM(frais_extra),0)       AS total_extras,
      COALESCE(SUM(frais_inscription + frais_mois + frais_carte + frais_extra),0) AS chiffre_affaires
    FROM etudiants
  ")->fetch();

  $totalInscriptions = (float)($row['total_inscriptions'] ?? 0);
  $totalScolarite = (float)($row['total_scolarite'] ?? 0);
  $totalCartes = (float)($row['total_cartes'] ?? 0);
  // "Frais perçus / CA" should come from finance journal if available
  $chiffreAffaires = $fin['total_encaissements'] > 0 ? $fin['total_encaissements'] : (float)($row['chiffre_affaires'] ?? 0);

  // Recent inscriptions (last 5)
  $stmt = $pdo->query("
    SELECT
      e.id,
      CONCAT(e.nom, ' ', e.prenom) AS nom_complet,
      e.matricule,
      e.statut,
      f.acro AS filiere_acro
    FROM etudiants e
    INNER JOIN filiere f ON f.id = e.filiere_id
    ORDER BY COALESCE(e.date_inscription, DATE(e.created_at)) DESC, e.id DESC
    LIMIT 5
  ");
  $recent = $stmt->fetchAll();

  // Effectifs par filière (top 8 + "Autres")
  $stmt = $pdo->query("
    SELECT f.acro, COUNT(*) AS n
    FROM etudiants e
    INNER JOIN filiere f ON f.id = e.filiere_id
    GROUP BY f.acro
    ORDER BY n DESC, f.acro ASC
  ");
  $byFiliere = $stmt->fetchAll();

  // Revenus mensuels (12 derniers mois)
  // Source 1: finance_operations (Encaissements). Fallback: etudiants fees.
  $monthly = [];
  if ($tableExists('finance_operations')) {
    $stmt = $pdo->query("
      SELECT
        DATE_FORMAT(date_op, '%Y-%m') AS ym,
        COALESCE(SUM(CASE WHEN type='Encaissement' THEN montant ELSE 0 END),0) AS total
      FROM finance_operations
      WHERE date_op >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY ym
      ORDER BY ym ASC
    ");
    $monthly = $stmt->fetchAll();
  }
  if (!$monthly) {
    $stmt = $pdo->query("
      SELECT
        DATE_FORMAT(COALESCE(e.date_inscription, DATE(e.created_at)), '%Y-%m') AS ym,
        COALESCE(SUM(e.frais_inscription + e.frais_mois + e.frais_carte + e.frais_extra),0) AS total
      FROM etudiants e
      WHERE COALESCE(e.date_inscription, DATE(e.created_at)) >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY ym
      ORDER BY ym ASC
    ");
    $monthly = $stmt->fetchAll();
  }

  echo json_encode([
    'status' => 'success',
    'data' => [
      'counts' => [
        'etudiants' => $etudiants,
        'personnel' => $personnel,
        'filieres' => $filieres,
      ],
      'sums' => [
        'chiffre_affaires' => $chiffreAffaires,
        'total_inscriptions' => $totalInscriptions,
        'total_scolarite' => $totalScolarite,
        'total_cartes' => $totalCartes,
      ],
      'finances' => $fin,
      'recent_inscriptions' => $recent,
      'effectifs_par_filiere' => $byFiliere,
      'revenus_mensuels' => $monthly,
    ]
  ]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}
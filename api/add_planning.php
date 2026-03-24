<?php
declare(strict_types=1);

require_once __DIR__ . '/auth_required.php';
require_once __DIR__ . '/db_connect.php';

header('Content-Type: application/json; charset=utf-8');

try {
  if (empty($_FILES['fichier']) || !is_uploaded_file($_FILES['fichier']['tmp_name'])) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Fichier PDF requis.']);
    exit;
  }
  $mime = (string)($_FILES['fichier']['type'] ?? '');
  if (stripos($mime, 'pdf') === false) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Seuls les PDF sont acceptés.']);
    exit;
  }
  $titre = trim((string)($_POST['titre'] ?? ''));
  if ($titre === '') {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Titre requis.']);
    exit;
  }

  $dir = __DIR__ . '/../uploads/planning';
  if (!is_dir($dir)) mkdir($dir, 0775, true);
  $orig = (string)$_FILES['fichier']['name'];
  $safe = preg_replace('/[^A-Za-z0-9._-]/', '_', $orig) ?: 'planning.pdf';
  $name = date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '_' . $safe;
  $abs = $dir . '/' . $name;
  $rel = 'uploads/planning/' . $name;
  move_uploaded_file($_FILES['fichier']['tmp_name'], $abs);

  $stmt = $pdo->prepare("
    INSERT INTO academic_plannings (
      titre, type_planning, annee_academique, semestre, secteur_key, niveau, filiere_acro, vague,
      fichier_nom, fichier_path, fichier_size, uploaded_by_admin_id, uploaded_by_name
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
  ");
  $stmt->execute([
    $titre,
    trim((string)($_POST['type_planning'] ?? 'Emploi du temps')),
    trim((string)($_POST['annee_academique'] ?? '')),
    trim((string)($_POST['semestre'] ?? '')),
    trim((string)($_POST['secteur_key'] ?? '')),
    trim((string)($_POST['niveau'] ?? '')),
    trim((string)($_POST['filiere_acro'] ?? '')),
    trim((string)($_POST['vague'] ?? '')),
    $orig,
    $rel,
    (int)($_FILES['fichier']['size'] ?? 0),
    (int)($_SESSION['admin_id'] ?? 0),
    (string)($_SESSION['admin_display_name'] ?? '')
  ]);
  echo json_encode(['status' => 'success', 'id' => (int)$pdo->lastInsertId()]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}


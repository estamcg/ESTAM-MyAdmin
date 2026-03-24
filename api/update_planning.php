<?php
declare(strict_types=1);

require_once __DIR__ . '/auth_required.php';
require_once __DIR__ . '/db_connect.php';

header('Content-Type: application/json; charset=utf-8');

try {
  $id = (int)($_POST['id'] ?? 0);
  if ($id <= 0) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'ID invalide.']);
    exit;
  }
  $stmt = $pdo->prepare("SELECT * FROM academic_plannings WHERE id=? LIMIT 1");
  $stmt->execute([$id]);
  $p = $stmt->fetch();
  if (!$p) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Planning introuvable.']);
    exit;
  }

  $path = (string)$p['fichier_path'];
  $nom = (string)$p['fichier_nom'];
  $size = (int)$p['fichier_size'];

  if (!empty($_FILES['fichier']) && is_uploaded_file($_FILES['fichier']['tmp_name'])) {
    $mime = (string)($_FILES['fichier']['type'] ?? '');
    if (stripos($mime, 'pdf') === false) {
      http_response_code(422);
      echo json_encode(['status' => 'error', 'message' => 'Seuls les PDF sont acceptés.']);
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
    $old = __DIR__ . '/../' . $path;
    if ($path !== '' && is_file($old)) @unlink($old);
    $path = $rel;
    $nom = $orig;
    $size = (int)($_FILES['fichier']['size'] ?? 0);
  }

  $stmt = $pdo->prepare("
    UPDATE academic_plannings
    SET titre=?, type_planning=?, annee_academique=?, semestre=?, secteur_key=?, niveau=?, filiere_acro=?, vague=?,
        fichier_nom=?, fichier_path=?, fichier_size=?
    WHERE id=?
  ");
  $stmt->execute([
    trim((string)($_POST['titre'] ?? $p['titre'])),
    trim((string)($_POST['type_planning'] ?? $p['type_planning'])),
    trim((string)($_POST['annee_academique'] ?? $p['annee_academique'] ?? '')),
    trim((string)($_POST['semestre'] ?? $p['semestre'] ?? '')),
    trim((string)($_POST['secteur_key'] ?? $p['secteur_key'] ?? '')),
    trim((string)($_POST['niveau'] ?? $p['niveau'] ?? '')),
    trim((string)($_POST['filiere_acro'] ?? $p['filiere_acro'] ?? '')),
    trim((string)($_POST['vague'] ?? $p['vague'] ?? '')),
    $nom,
    $path,
    $size,
    $id
  ]);
  echo json_encode(['status' => 'success']);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}


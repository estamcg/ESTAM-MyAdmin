<?php
declare(strict_types=1);

require_once __DIR__ . '/auth_required.php';
require_once __DIR__ . '/db_connect.php';

header('Content-Type: application/json; charset=utf-8');

try {
  if (empty($_FILES['fichier']) || !is_uploaded_file($_FILES['fichier']['tmp_name'])) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Fichier requis.']);
    exit;
  }

  $titre = trim((string)($_POST['titre'] ?? ''));
  $categorie = trim((string)($_POST['categorie'] ?? ''));
  if ($titre === '' || $categorie === '') {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Titre et catégorie requis.']);
    exit;
  }

  $uploadDir = __DIR__ . '/../uploads/bibliotheque';
  if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0775, true);
  }

  $orig = (string)$_FILES['fichier']['name'];
  $safe = preg_replace('/[^A-Za-z0-9._-]/', '_', $orig) ?: 'document.bin';
  $targetName = date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '_' . $safe;
  $targetAbs = $uploadDir . '/' . $targetName;
  $targetRel = 'uploads/bibliotheque/' . $targetName;
  move_uploaded_file($_FILES['fichier']['tmp_name'], $targetAbs);

  $stmt = $pdo->prepare("
    INSERT INTO bibliotheque_documents (
      titre, categorie, description, fichier_nom, fichier_path, fichier_mime, fichier_size,
      secteur_key, niveau, filiere_acro, vague, published_by_admin_id, published_by_name
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
  ");
  $stmt->execute([
    $titre,
    $categorie,
    trim((string)($_POST['description'] ?? '')),
    $orig,
    $targetRel,
    (string)($_FILES['fichier']['type'] ?? ''),
    (int)($_FILES['fichier']['size'] ?? 0),
    trim((string)($_POST['secteur_key'] ?? '')),
    trim((string)($_POST['niveau'] ?? '')),
    trim((string)($_POST['filiere_acro'] ?? '')),
    trim((string)($_POST['vague'] ?? '')),
    (int)($_SESSION['admin_id'] ?? 0),
    (string)($_SESSION['admin_display_name'] ?? '')
  ]);

  echo json_encode(['status' => 'success', 'id' => (int)$pdo->lastInsertId()]);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}


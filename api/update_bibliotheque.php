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

  $stmt = $pdo->prepare("SELECT * FROM bibliotheque_documents WHERE id=? LIMIT 1");
  $stmt->execute([$id]);
  $doc = $stmt->fetch();
  if (!$doc) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Document introuvable.']);
    exit;
  }

  $isSuper = stripos((string)($_SESSION['admin_role'] ?? ''), 'super') !== false;
  $currentAdminId = (int)($_SESSION['admin_id'] ?? 0);
  if (!$isSuper && (int)$doc['published_by_admin_id'] !== $currentAdminId) {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Modification refusée.']);
    exit;
  }

  $titre = trim((string)($_POST['titre'] ?? $doc['titre']));
  $categorie = trim((string)($_POST['categorie'] ?? $doc['categorie']));
  if ($titre === '' || $categorie === '') {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Titre et catégorie requis.']);
    exit;
  }

  $path = (string)$doc['fichier_path'];
  $nom = (string)$doc['fichier_nom'];
  $mime = (string)$doc['fichier_mime'];
  $size = (int)$doc['fichier_size'];

  if (!empty($_FILES['fichier']) && is_uploaded_file($_FILES['fichier']['tmp_name'])) {
    $uploadDir = __DIR__ . '/../uploads/bibliotheque';
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0775, true);
    $orig = (string)$_FILES['fichier']['name'];
    $safe = preg_replace('/[^A-Za-z0-9._-]/', '_', $orig) ?: 'document.bin';
    $targetName = date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '_' . $safe;
    $targetAbs = $uploadDir . '/' . $targetName;
    $targetRel = 'uploads/bibliotheque/' . $targetName;
    move_uploaded_file($_FILES['fichier']['tmp_name'], $targetAbs);
    $oldAbs = __DIR__ . '/../' . $path;
    if ($path !== '' && is_file($oldAbs)) @unlink($oldAbs);
    $path = $targetRel;
    $nom = $orig;
    $mime = (string)($_FILES['fichier']['type'] ?? '');
    $size = (int)($_FILES['fichier']['size'] ?? 0);
  }

  $stmt = $pdo->prepare("
    UPDATE bibliotheque_documents
    SET titre=?, categorie=?, description=?, fichier_nom=?, fichier_path=?, fichier_mime=?, fichier_size=?,
        secteur_key=?, niveau=?, filiere_acro=?, vague=?
    WHERE id=?
  ");
  $stmt->execute([
    $titre,
    $categorie,
    trim((string)($_POST['description'] ?? $doc['description'] ?? '')),
    $nom,
    $path,
    $mime,
    $size,
    trim((string)($_POST['secteur_key'] ?? $doc['secteur_key'] ?? '')),
    trim((string)($_POST['niveau'] ?? $doc['niveau'] ?? '')),
    trim((string)($_POST['filiere_acro'] ?? $doc['filiere_acro'] ?? '')),
    trim((string)($_POST['vague'] ?? $doc['vague'] ?? '')),
    $id
  ]);

  echo json_encode(['status' => 'success']);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}


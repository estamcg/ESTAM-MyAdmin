<?php
declare(strict_types=1);

require_once __DIR__ . '/auth_required.php';
require_once __DIR__ . '/db_connect.php';

header('Content-Type: application/json; charset=utf-8');

try {
  $data = json_decode((string)file_get_contents('php://input'), true);
  if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Requête invalide.']);
    exit;
  }

  $type = trim((string)($data['type'] ?? ''));
  $categorie = trim((string)($data['categorie'] ?? ''));
  $libelle = trim((string)($data['libelle'] ?? ''));
  $piece = trim((string)($data['piece_no'] ?? ''));
  $montant = (float)($data['montant'] ?? 0);
  $dateOp = trim((string)($data['date_op'] ?? ''));

  if (!in_array($type, ['Encaissement', 'Décaissement'], true) || $categorie === '' || $libelle === '' || $piece === '' || $montant <= 0 || $dateOp === '') {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Champs obligatoires invalides.']);
    exit;
  }

  $stmt = $pdo->prepare("
    INSERT INTO finance_operations (type, categorie, libelle, piece_no, montant, date_op, created_by_admin_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  ");
  $stmt->execute([$type, $categorie, $libelle, $piece, $montant, $dateOp, (int)($_SESSION['admin_id'] ?? 0)]);

  echo json_encode(['status' => 'success', 'id' => (int)$pdo->lastInsertId()]);
} catch (PDOException $e) {
  if ((string)$e->getCode() === '23000') {
    http_response_code(409);
    echo json_encode(['status' => 'error', 'message' => 'Numéro de pièce déjà existant.']);
    exit;
  }
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur base de données.']);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['status' => 'error', 'message' => 'Erreur serveur.']);
}


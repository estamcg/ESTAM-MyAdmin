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

  $id = (int)($data['id'] ?? 0);
  $type = trim((string)($data['type'] ?? ''));
  $categorie = trim((string)($data['categorie'] ?? ''));
  $libelle = trim((string)($data['libelle'] ?? ''));
  $piece = trim((string)($data['piece_no'] ?? ''));
  $montant = (float)($data['montant'] ?? 0);
  $dateOp = trim((string)($data['date_op'] ?? ''));

  if ($id <= 0 || !in_array($type, ['Encaissement', 'Décaissement'], true) || $categorie === '' || $libelle === '' || $piece === '' || $montant <= 0 || $dateOp === '') {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Champs obligatoires invalides.']);
    exit;
  }

  $stmt = $pdo->prepare("
    UPDATE finance_operations
    SET type = ?, categorie = ?, libelle = ?, piece_no = ?, montant = ?, date_op = ?
    WHERE id = ?
  ");
  $stmt->execute([$type, $categorie, $libelle, $piece, $montant, $dateOp, $id]);

  if ($stmt->rowCount() === 0) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Opération introuvable ou inchangée.']);
    exit;
  }
  echo json_encode(['status' => 'success']);
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


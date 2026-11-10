<?php
header('Content-Type: application/json; charset=utf-8');

// Ako frontend i backend rade na različitim portovima/domenama, odkomentiraj CORS:
// header('Access-Control-Allow-Origin: *');
// header('Access-Control-Allow-Methods: POST, OPTIONS');
// header('Access-Control-Allow-Headers: Content-Type');
// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Dozvoljene su samo POST metode.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id']) || !isset($data['slika'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Nedostaju parametri: id i/ili slika.']);
    exit;
}

$idClean = preg_replace('/[^a-zA-Z0-9_\-]/', '', (string)$data['id']);
if ($idClean === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Neispravan id entiteta.']);
    exit;
}

$base64Image = $data['slika'];
if (preg_match('/^data:image\/\w+;base64,/', $base64Image)) {
    $base64Image = substr($base64Image, strpos($base64Image, ',') + 1);
}

$decodedImage = base64_decode($base64Image, true); // strict
if ($decodedImage === false) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Neispravan Base64 format slike.']);
    exit;
}

// Ograničenje veličine (2 MB) - ISPRAVLJENO
if (strlen($decodedImage) > 2 * 1024 * 1024) {
    http_response_code(413);
    echo json_encode(['success' => false, 'message' => 'Slika je prevelika (max 2 MB).']);
    exit;
}

// Provjera da je stvarno slika i određivanje ekstenzije prema sadržaju
$info = @getimagesizefromstring($decodedImage);
$dozvoljeno = [
    IMAGETYPE_JPEG => 'jpg',
    IMAGETYPE_PNG  => 'png',
    IMAGETYPE_WEBP => 'webp',
];

if ($info === false || !isset($dozvoljeno[$info[2]])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Dozvoljeni formati: JPG, PNG, WEBP.']);
    exit;
}
$ext = $dozvoljeno[$info[2]];

$targetDir = __DIR__ . '/slike';
if (!is_dir($targetDir)) {
    mkdir($targetDir, 0755, true);
}

// Pri promjeni slike obriši stare verzije (npr. 12.png kad stigne 12.jpg)
foreach ($dozvoljeno as $e) {
    $stara = $targetDir . '/' . $idClean . '.' . $e;
    if (is_file($stara)) {
        unlink($stara);
    }
}

$filePath = $targetDir . '/' . $idClean . '.' . $ext;

if (file_put_contents($filePath, $decodedImage) !== false) {
    echo json_encode([
        'success' => true,
        'message' => 'Slika je uspješno spremljena.',
        'path'    => 'slike/' . $idClean . '.' . $ext
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Pogreška prilikom zapisivanja datoteke na disk.']);
}
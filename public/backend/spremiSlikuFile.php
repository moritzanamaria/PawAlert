<?php
header('Content-Type: application/json; charset=utf-8');

$dopusteni = ['http://localhost:5173', 'https://edunova33.origo.hr'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $dopusteni, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
 header('Access-Control-Allow-Methods: POST, OPTIONS');
 header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

function odgovor($status, $podaci) {
    http_response_code($status);
    echo json_encode($podaci);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    odgovor(405, ['success' => false, 'message' => 'Dozvoljene su samo POST metode.']);
}

if (!isset($_POST['id']) || !isset($_FILES['slika'])) {
    odgovor(400, ['success' => false, 'message' => 'Nedostaju parametri: id i/ili slika.']);
}

$id = preg_replace('/[^a-zA-Z0-9_\-]/', '', (string)$_POST['id']);
if ($id === '') {
    odgovor(400, ['success' => false, 'message' => 'Neispravan id traga.']);
}
$idClean = "trag_{$id}";

$file = $_FILES['slika'];

if ($file['error'] === UPLOAD_ERR_INI_SIZE || $file['error'] === UPLOAD_ERR_FORM_SIZE) {
    odgovor(413, ['success' => false, 'message' => 'Slika je prevelika.']);
}
if ($file['error'] !== UPLOAD_ERR_OK) {
    odgovor(400, ['success' => false, 'message' => 'Greška pri prijenosu datoteke (kod ' . $file['error'] . ').']);
}
if ($file['size'] > 2 * 1024 * 1024) {
    odgovor(413, ['success' => false, 'message' => 'Slika je prevelika (max 2 MB).']);
}

// Provjera sadržaja
$info = @getimagesize($file['tmp_name']);
$dozvoljeno = [
    IMAGETYPE_JPEG => 'jpg',
    IMAGETYPE_PNG  => 'png',
    IMAGETYPE_WEBP => 'webp',
];
if ($info === false || !isset($dozvoljeno[$info[2]])) {
    odgovor(400, ['success' => false, 'message' => 'Dozvoljeni formati: JPG, PNG, WEBP.']);
}
$ext = $dozvoljeno[$info[2]];

$targetDir = __DIR__ . '/slike';
if (!is_dir($targetDir)) {
    mkdir($targetDir, 0755, true);
}

// Obriši stare verzije istog traga (npr. trag_5.png kad stigne trag_5.jpg)
foreach ($dozvoljeno as $e) {
    $stara = $targetDir . '/' . $idClean . '.' . $e;
    if (is_file($stara)) {
        unlink($stara);
    }
}

$filePath = $targetDir . '/' . $idClean . '.' . $ext;

if (move_uploaded_file($file['tmp_name'], $filePath)) {
    odgovor(200, [
        'success' => true,
        'message' => 'Slika je uspješno spremljena.',
        'path'    => 'slike/' . $idClean . '.' . $ext
    ]);
} else {
    odgovor(500, ['success' => false, 'message' => 'Pogreška prilikom zapisivanja datoteke na disk.']);
}
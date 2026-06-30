<?php
require_once './config/cors.php';
require_once './db/connection.php';

date_default_timezone_set("Asia/Tokyo");
if($config['debagOnOff']) {
  ini_set("log_errors", "1");
  ini_set("error_log", __DIR__ . "/debug.log");
// error_log("デバッグ開始");
}

$db = getDB();
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? null;
$name = $data['name'] ?? '';

if (!$id || !$name) {
    echo json_encode(["success" => false]);
    exit;
}

try {
    $stmt = $db->prepare("
        UPDATE groups
        SET name = :name,
            updated_at = datetime('now','localtime')
        WHERE id = :id
    ");

    $stmt->execute([
        ':name' => $name,
        ':id' => $id
    ]);

    echo json_encode(["success" => true]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

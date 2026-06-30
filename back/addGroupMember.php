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

$data = json_decode(file_get_contents("php://input"), true);

$groupId = $data['groupId'];
$userId = $data['userId'];

try {
    $stmt = $db->prepare("
        INSERT INTO group_members (group_id, user_id)
        VALUES (:group_id, :user_id)
    ");

    $stmt->execute([
        ':group_id' => $groupId,
        ':user_id' => $userId
    ]);

    echo json_encode(["success" => true]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

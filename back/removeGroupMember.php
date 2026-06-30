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

$stmt = $db->prepare("
    DELETE FROM group_members
    WHERE group_id = :group_id AND user_id = :user_id
");

$stmt->execute([
    ':group_id' => $groupId,
    ':user_id' => $userId
]);

echo json_encode(["success" => true]);

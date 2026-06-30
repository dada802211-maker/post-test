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

try {
    $db->beginTransaction();

    $db->prepare("DELETE FROM group_members WHERE group_id = :id")
       ->execute([':id' => $groupId]);

    $db->prepare("DELETE FROM groups WHERE id = :id")
       ->execute([':id' => $groupId]);

    $db->commit();

    echo json_encode(["success" => true]);

} catch (Exception $e) {
    $db->rollBack();
    echo json_encode(["success" => false]);
}

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

$groupId = $_GET['id'] ?? null;

if (!$groupId) {
    echo json_encode(["success" => false, "message" => "IDがありません"]);
    exit;
}

try {
    // グループ情報
    $stmt = $db->prepare("SELECT * FROM groups WHERE id = :id");
    $stmt->execute([':id' => $groupId]);
    $group = $stmt->fetch(PDO::FETCH_ASSOC);

    // メンバー一覧
    $stmt = $db->prepare("
        SELECT u.id, u.name, u.email
        FROM group_members gm
        JOIN users u ON gm.user_id = u.id
        WHERE gm.group_id = :id
    ");
    $stmt->execute([':id' => $groupId]);
    $members = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "group" => $group,
        "members" => $members
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

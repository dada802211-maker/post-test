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
// POSTデータ取得
$data = json_decode(file_get_contents("php://input"), true);

$groupName = $data['groupName'] ?? '';
$userIds = $data['userIds'] ?? [];

if (!$groupName || empty($userIds)) {
    echo json_encode([
        "success" => false,
        "message" => "データ不足"
    ]);
    exit;
}

try {
    // トランザクション開始（重要）
    $db->beginTransaction();

    // ① groupsに登録
    $stmt = $db->prepare("
        INSERT INTO groups (name)
        VALUES (:name)
    ");
    $stmt->execute([
        ':name' => $groupName
    ]);

    // 作成したgroupのID取得
    $groupId = $db->lastInsertId();

    // ② group_membersに登録
    $stmt = $db->prepare("
        INSERT INTO group_members (group_id, user_id)
        VALUES (:group_id, :user_id)
    ");

    foreach ($userIds as $userId) {
        $stmt->execute([
            ':group_id' => $groupId,
            ':user_id' => $userId
        ]);
    }

    // コミット
    $db->commit();

    echo json_encode([
        "success" => true,
        "groupId" => $groupId
    ]);

} catch (Exception $e) {
    $db->rollBack();

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

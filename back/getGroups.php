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
$db->exec("PRAGMA foreign_keys = ON;");

try {
    $stmt = $db->query("
        SELECT
            g.id,
            g.name,
            g.created_at,
            COUNT(gm.user_id) as member_count
        FROM groups g
        LEFT JOIN group_members gm ON g.id = gm.group_id
        GROUP BY g.id
        ORDER BY g.created_at DESC
    ");

    $groups = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($groups);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}

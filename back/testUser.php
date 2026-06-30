<?php
$db = new PDO('sqlite:./reactbak.sqlite');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// プリペアドステートメント
$stmt = $db->prepare("
    INSERT INTO users (id, name, email, password)
    VALUES (:id, :name, :email, :password)
");

// 例：50件作成
for ($i = 1; $i <= 50; $i++) {
    $id = "abc{$i}";
    $name = "テストユーザー{$i}";
    $email = "test{$i}@example.com";
    $password = password_hash("password123", PASSWORD_DEFAULT);

    $stmt->execute([
        ':id' => $id,
        ':name' => $name,
        ':email' => $email,
        ':password' => $password,
    ]);
}

echo "完了！";

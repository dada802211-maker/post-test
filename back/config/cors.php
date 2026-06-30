<?php

$config = require './config/env.php';

// 🔥 リクエスト元のオリジン（ドメイン）が設定と一致する場合のみCORS許可
if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] === $config['origin']) {
    // アクセスを許可するオリジンを指定（フロント側のURL）
    header("Access-Control-Allow-Origin: " . $config['origin']);
    // Cookieや認証情報（セッションなど）を含めた通信を許可
    header("Access-Control-Allow-Credentials: true");
}

// 🔥 許可するHTTPメソッドを指定（APIで使うもの）
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
// 🔥 許可するリクエストヘッダー（フロントから送れるヘッダー）
header("Access-Control-Allow-Headers: Content-Type");

// 🔥 プリフライトリクエスト（OPTIONS）はここで即終了
// ブラウザが本リクエスト前に「送っていい？」と確認するためのもの
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // 正常応答を返す（中身は不要）
    http_response_code(200);
    // ここで処理終了（認証やDB処理などは絶対しない）
    exit;
}

/*
🔑 ポイントまとめ
CORSヘッダーは最初に返す必要がある
OPTIONSは本処理に入る前に必ず終了する
Allow-Credentials を使う場合は * は使えない（オリジン固定必須）
*/

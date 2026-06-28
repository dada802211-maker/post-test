import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function Layout() {
  return (
    <>
      {/* 共通ヘッダー */}
      <Header />

      {/* ページごとの中身 */}
      <main className="l-container">
        <Outlet />
      </main>

      {/* 共通フッター */}
      <footer>
        <p>© 2026 POST TEST</p>
      </footer>
    </>
  );
}

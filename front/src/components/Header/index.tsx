import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="l-header">
      <div className="l-header__inner">
        <h1 className="l-header__logo">MyApp</h1>

        {/* ===== PCメニュー ===== */}
        <nav className="l-header__nav pc-only">
          <ul>
            <li>
              <Link to="/">ホーム</Link>
            </li>
            <li>
              <Link to="/group-list">グループ一覧</Link>
            </li>
            <li>
              <Link to="/group-create">グループ新規登録</Link>
            </li>

          </ul>
        </nav>

        <button
          className="c-menu-btn sp-only"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* ===== オーバーレイ ===== */}
      {isOpen && (
        <div
          className="c-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ===== SPサイドメニュー ===== */}
      <div className={`c-side-menu ${isOpen ? "is-open" : ""}`}>
        <ul>
          <li>
            <Link to="/" onClick={() => setIsOpen(false)}>
              ホーム
            </Link>
          </li>

          <li onClick={() => setIsOpen(false)}>
            <Link to="/group-create">グループ新規登録</Link>
          </li>
        </ul>
      </div>
    </header>
  )
}

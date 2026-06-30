import { useEffect, useState } from "react";
import "./GroupList.scss";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

type Group = {
  id: number;
  name: string;
  created_at: string;
  member_count: number;
};

export default function GroupList() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const baseURL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${baseURL}/getGroups.php`)
      .then((res) => res.json())
      .then(setGroups)
      .catch(console.error);
  }, []);

  // 編集開始
  const handleEdit = (group: Group) => {
    setEditingId(group.id);
    setEditName(group.name);
  };

  // 保存
  const handleSave = async (id: number) => {
    if (!editName.trim()) return;
    const res = await fetch(`${baseURL}/updateGroup.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, name: editName }),
    });

    const data = await res.json();

    if (data.success) {
      setGroups((prev) =>
        prev.map((g) =>
          g.id === id ? { ...g, name: editName } : g
        )
      );
      setEditingId(null);
      toast.success("更新しました");
      navigate('/group-list');
    }
  };

  // 削除
  const handleDelete = async (id: number) => {
    if (!confirm("削除しますか？")) return;

    const res = await fetch(`${baseURL}/deleteGroup.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ groupId: id }),
    });

    const data = await res.json();

    if (data.success) {
      setGroups((prev) => prev.filter((g) => g.id !== id));
    }
    toast.success("削除しました");
  };

  return (
    <div className="group-list">
      <h2 className="group-list__title">グループ一覧</h2>

      {groups.length === 0 ? (
        <p className="group-list__empty">グループがありません</p>
      ) : (
        <ul className="group-list__items">
          {groups.map((group) => (
            <li key={group.id} className="group-list__item">
              <div className="group-list__card">
                <div className="group-list__header">
                  {editingId === group.id ? (
                    <input
                      className="group-list__input"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSave(group.id);
                      }}
                    />
                  ) : (
                    <h3 className="group-list__name">
                      {group.name}
                    </h3>
                  )}
                  <Link to={`/group-detail/${group.id}`}>
                    <span className="group-list__count">
                      {group.member_count}人
                    </span>
                  </Link>
                </div>

                <div className="group-list__actions">
                  {editingId === group.id ? (
                    <button
                      onClick={() => handleSave(group.id)}
                    >
                      保存
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(group)}
                    >
                      編集
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(group.id)}
                    className="danger"
                  >
                    削除
                  </button>
                </div>

                <div className="group-list__meta">
                  作成日: {group.created_at}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

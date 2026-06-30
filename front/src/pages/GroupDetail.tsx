import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "./GroupDetail.scss";

type User = {
  id: string;
  name: string;
  email: string;
};

type Group = {
  id: number;
  name: string;
};

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL;

  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // 初期ロード
  useEffect(() => {
    fetch(`${baseURL}/getGroupDetail.php?id=${id}`)
      .then(res => res.json())
      .then(data => {
        setGroup(data.group);
        setMembers(data.members);
      });

    fetch(`${baseURL}/users.php`)
      .then(res => res.json())
      .then(setUsers);
  }, [id]);

  // メンバー追加
  const handleAdd = async (userId: string) => {
    const res = await fetch(`${baseURL}/addGroupMember.php`, {
      method: "POST",
      body: JSON.stringify({ groupId: id, userId }),
    });

    const data = await res.json();
    if (data.success) {
      toast.success("追加しました");
      location.reload();
    }
  };

  // メンバー削除
  const handleRemove = async (userId: string) => {
    await fetch(`${baseURL}/removeGroupMember.php`, {
      method: "POST",
      body: JSON.stringify({ groupId: id, userId }),
    });

    toast.success("削除しました");
    setMembers(prev => prev.filter(m => m.id !== userId));
  };

  // グループ削除
  const handleDelete = async () => {
    if (!confirm("削除しますか？")) return;

    const res = await fetch(`${baseURL}/deleteGroup.php`, {
      method: "POST",
      body: JSON.stringify({ groupId: id }),
    });

    const data = await res.json();

    if (data.success) {
      toast.success("削除しました");
      navigate("/");
    }
  };

  if (!group) return <p>Loading...</p>;

  return (
    <div className="group-detail">
      <h2 className="group-detail__title">{group.name}</h2>

      <button
        className="group-detail__delete"
        onClick={handleDelete}
      >
        グループ削除
      </button>

      <h3>メンバー</h3>
      <ul className="group-detail__members">
        {members.map((m) => (
          <li key={m.id} className="group-detail__member">
            {m.name}
            <button onClick={() => handleRemove(m.id)}>
              削除
            </button>
          </li>
        ))}
      </ul>

      <h3>ユーザー追加</h3>
      <ul className="group-detail__users">
        {users.map((u) => (
          <li key={u.id}>
            {u.name}
            <button onClick={() => handleAdd(u.id)}>
              追加
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

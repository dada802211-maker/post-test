import { useEffect, useState } from 'react';
import './GroupCreate.scss';
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
};

export default function GroupCreate() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [groupName, setGroupName] = useState('');
  const baseURL = import.meta.env.VITE_API_URL;

  const handleCheck = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  useEffect(() => {
    fetch(`${baseURL}/users.php`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);

        // ここでログ
        // data.forEach(user => {
        //   console.log(user.name);
        // });
      })
      .catch((err) => console.error(err));
  }, []);

  // useEffect(() => {
  //   users.forEach(user => {
  //     console.log(user.id);
  //     console.log(user.name);
  //     console.log(user.email);
  //   });
  // }, [users]);
  const handleSubmit = async () => {
    try {
      const res = await fetch(`${baseURL}/createGroup.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          groupName,
          userIds: selectedIds,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("グループを作成しました 🎉");

        // リセット（おすすめ）
        setGroupName("");
        setSelectedIds([]);
      } else {
        toast.error(data.message || "作成に失敗しました");
      }

    } catch (err) {
      console.error(err);
      toast.error("通信エラーが発生しました");
    }
  };

  return (
    <div className="group-create">
      <h2 className="group-create__title">ユーザー選択</h2>

      <div className="group-create__header">
        <button
          className="group-create__submit"
          onClick={handleSubmit}
          disabled={!groupName}
        >
          グループ作成
        </button>

        <div className="group-create__form">
          <label className="group-create__label">
            グループ名
          </label>
          <input
            className="group-create__input"
            type="text"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
          />
        </div>
      </div>

      <div className="group-create__list">
        {users.map((user) => (
          <label
            key={user.id}
            className="group-create__item"
          >
            <input
              className="group-create__checkbox"
              type="checkbox"
              checked={selectedIds.includes(user.id)}
              onChange={() => handleCheck(user.id)}
            />
            <span className="group-create__user">
              {user.name} ({user.email})
            </span>
          </label>
        ))}
      </div>

      <div className="group-create__selected">
        <h3>選択されたユーザー</h3>

        <pre className="group-create__json">
          {JSON.stringify(selectedIds, null, 2)}
        </pre>

        <ul className="group-create__selected-list">
          {selectedIds.map((id) => {
            const user = users.find((u) => u.id === id);
            return (
              <li key={id} className="group-create__selected-item">
                {user
                  ? `${user.name} (${user.email})`
                  : "不明なユーザー"}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react'

type User = {
  id: string;
  name: string;
  email: string;
};

export default function GroupCreate() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
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

  return (
    <div style={{ color: "#333", padding: "20px" }}>
      <h2>ユーザー選択</h2>

      <div
        style={{
          height: "300px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      >
        {users.map((user) => (
          <label
            key={user.id}
            style={{
              display: "block",
              marginBottom: "8px",
            }}
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(user.id)}
              onChange={() => handleCheck(user.id)}
            />
            {" "}
            {user.name}({user.email})
          </label>
        ))}
      </div>

      <h3>選択されたユーザー</h3>
      <pre>{JSON.stringify(selectedIds, null, 2)}</pre>
      <h3>選択されたユーザー</h3>
      <ul>
        {selectedIds.map((id) => {
          const user = users.find((u) => u.id === id);
          return (
            <li key={id}>
              {user ? `${user.name} (${user.email})` : "不明なユーザー"}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

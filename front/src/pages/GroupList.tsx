import { useEffect, useState } from "react";
import "./GroupList.scss";
import { Link } from "react-router-dom";

type Group = {
  id: number;
  name: string;
  created_at: string;
  member_count: number;
};

export default function GroupList() {
  const [groups, setGroups] = useState<Group[]>([]);
  const baseURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${baseURL}/getGroups.php`)
      .then((res) => res.json())
      .then((data) => {
        setGroups(data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="group-list">
      <h2 className="group-list__title">グループ一覧</h2>

      {groups.length === 0 ? (
        <p className="group-list__empty">グループがありません</p>
      ) : (
        <ul className="group-list__items">
          {groups.map((group) => (
            <li key={group.id} className="group-list__item">
              <Link to={`/group-detail/${group.id}`}>
                <div className="group-list__card">
                  <div className="group-list__header">
                    <h3 className="group-list__name">
                      {group.name}
                    </h3>
                    <span className="group-list__count">
                      {group.member_count}人
                    </span>
                  </div>

                  <div className="group-list__meta">
                    作成日: {group.created_at}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

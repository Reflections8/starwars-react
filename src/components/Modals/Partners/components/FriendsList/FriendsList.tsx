import "./styles/FriendsList.css";
import userIcon from "./img/User.svg";
import { useEffect, useState } from "react";
import { InvitedUser, useUserData } from "../../../../../UserDataService.tsx";

export function FriendsList() {
  const [friends, setFriends] = useState<Array<{
    link: string;
    name: string;
    profit: number;
  }> | null>(null);

  const { refInfo } = useUserData();

  useEffect(() => {
    if (refInfo && refInfo.invited_users) {
      const newFriends = refInfo.invited_users.map((user: InvitedUser) => ({
        link: "#", // Замените на фактическую ссылку, если доступна
        name: user.username,
        profit: user.reward || 0,
      }));
      setFriends(newFriends);
    } else {
      setFriends([]);
    }
  }, [refInfo]);

  if (friends === null) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="friendsList">
      <div className="friendsList__header">
        <div className="friendsList__header-name">Name</div>
        <div className="friendsList__header-profit">Profit</div>
      </div>

      <div className="friendsList__list">
        {friends.map((row, index) => {
          return (
            <div className="friendsList__list-item" key={index}>
              <div className="friendsList__list-item-nameBlock">
                <img
                  src={userIcon}
                  alt="user"
                  className="friendsList__list-item-nameBlock-icon"
                />
                <a
                  href={row.link}
                  className="friendsList__list-item-nameBlock-name"
                >
                  {row.name}
                </a>
              </div>

              <div className="friendsList__list-item-profit">
                {row.profit} TON
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

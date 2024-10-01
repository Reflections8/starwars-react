import "./styles/FriendsList.css";
import userIcon from "./img/User.svg";
import noAvatar from "../../../../../icons/no_avatar.png";
import { useEffect, useState } from "react";
import { InvitedUser, useUserData } from "../../../../../UserDataService.tsx";
import { useTranslation } from "react-i18next";
import { fetchUserPhoto } from "../../../../../components/Modals/SeaBattle/service/sea-battle.service";

export function FriendsList() {
  const { t } = useTranslation();
  const [friends, setFriends] = useState<Array<{
    link: string;
    name: string;
    profit: number;
    photo?: string; // Поле для хранения фото
  }> | null>(null);
  const { refInfo } = useUserData();

  useEffect(() => {
    console.log({ refInfo });
    if (refInfo && refInfo.invited_users) {
      const newFriends = refInfo.invited_users.map((user: InvitedUser) => ({
        link: "#", // Замените на фактическую ссылку, если доступна
        name: user.value,
        profit: user.reward || 0,
        type: user.type,
      }));
      setFriends(newFriends);
    } else {
      setFriends([]);
    }
  }, [refInfo]);

  useEffect(() => {
    const fetchPhotos = async () => {
      const updatedFriends = await Promise.all(
        friends?.map(async (friend) => {
          // @ts-ignore
          if (friend.type === 0) {
            const photo = await fetchUserPhoto(friend.name);
            friend.photo = photo || noAvatar;
            // @ts-ignore
          } else if (friend.type === 1) {
            friend.photo = noAvatar;
          }
          return friend;
        }) || []
      );
      setFriends(updatedFriends);
    };

    if (friends) {
      fetchPhotos();
    }
  }, [friends]);

  if (friends === null) {
    return <div>{t("global.loading")}...</div>;
  }

  return (
    <div className="friendsList">
      <div className="friendsList__header">
        <div className="friendsList__header-name">
          {t("partnersModal.friendsListTab.name")}
        </div>
        <div className="friendsList__header-profit">
          {t("partnersModal.friendsListTab.profit")}
        </div>
      </div>

      <div className="friendsList__list">
        {friends.map((row, index) => (
          <div className="friendsList__list-item" key={index}>
            <div className="friendsList__list-item-nameBlock">
              <img
                src={row.photo || userIcon}
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
        ))}
      </div>
    </div>
  );
}

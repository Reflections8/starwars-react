import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchUserPhoto } from "../../../../components/Modals/SeaBattle/service/sea-battle.service";
import { useBattleships } from "../../../../context/BattleshipsContext";
import avatarBg from "./img/avatar-bg.png";
import leftBg from "./img/left-bg.svg";
import rightBg from "./img/turn-bg.svg";
import "./styles/GameHeader.css";
import defaultAva from "../../../../icons/no_avatar.png";

export const GameHeader: FC<{ myTurn: boolean }> = ({ myTurn }) => {
  const { t } = useTranslation();
  //   const [rivalName] = useState("@pashadurovoffasdjaksd");
  const { opponentName } = useBattleships();

  const [enemyPhoto, setEnemyPhoto] = useState(null);

  async function loadOpponentAvatar(username: string) {
    const res = await fetchUserPhoto(username);
    // @ts-ignore
    setEnemyPhoto(res);
  }

  useEffect(() => {
    if (opponentName) {
      loadOpponentAvatar(opponentName);
    }
  }, [opponentName]);

  const [myTurnDebounced, setMyTurnDebounced] = useState(myTurn);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);

    setTimeout(() => {
      setMyTurnDebounced(myTurn);
    }, 375);

    const timer = setTimeout(() => setAnimate(false), 750);
    return () => clearTimeout(timer);
  }, [myTurn]);
  return (
    <div className="gameHeader">
      {/* LEFT BLOCK */}
      <div className="gameHeader__left">
        <img src={leftBg} alt="bg" className="gameHeader__left-bg" />

        {/* AVATAR BLOCK */}
        <div className="gameHeader__left-avatarBlock">
          <img
            src={avatarBg}
            alt="avatar-bg"
            className="gameHeader__left-avatarBlock-bg"
          />

          {enemyPhoto ? (
            <img
              src={enemyPhoto || ""}
              alt=""
              width="46px"
              className="gameHeader__left-avatarBlock-avatar check-image"
            />
          ) : (
            <img
              src={defaultAva}
              alt=""
              width="46px"
              className="gameHeader__left-avatarBlock-avatarDefault"
            />
          )}
        </div>

        {/* INFO BLOCK */}
        <div className="gameHeader__infoBlock">
          <div className="gameHeader__infoBlock-key">
            {t("battleships.yourRival")}:
          </div>
          <div className="gameHeader__infoBlock-value">
            @{opponentName || ""}
          </div>
        </div>
      </div>

      {/* RIGHT BLOCK */}
      <div className={`gameHeader__right ${animate ? "animate" : ""}`}>
        <img src={rightBg} alt="" className="gameHeader__right-bg" />

        <div className="gameHeader__right-key">{t("battleships.turn")}:</div>
        <div className="gameHeader__right-value">
          {myTurnDebounced ? t("battleships.yours") : t("battleships.rivals")}
        </div>
      </div>
    </div>
  );
};

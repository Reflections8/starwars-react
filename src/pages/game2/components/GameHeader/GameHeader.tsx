import "./styles/GameHeader.css";
import leftBg from "./img/left-bg.svg";
import rightBg from "./img/turn-bg.svg";
import avatarBg from "./img/avatar-bg.png";
import avatar from "./img/avatar.png";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const GameHeader: FC<{ myTurn: boolean }> = ({ myTurn }) => {
  const { t } = useTranslation();
  const [rivalName] = useState("@pashadurovoffasdjaksd");

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

          <img
            src={avatar}
            alt="avatar"
            className="gameHeader__left-avatarBlock-avatar"
          />
        </div>

        {/* INFO BLOCK */}
        <div className="gameHeader__infoBlock">
          <div className="gameHeader__infoBlock-key">
            {t("battleships.yourRival")}:
          </div>
          <div className="gameHeader__infoBlock-value">{rivalName}</div>
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

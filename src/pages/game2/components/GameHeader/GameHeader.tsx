import "./styles/GameHeader.css";
import leftBg from "./img/left-bg.svg";
import rightBg from "./img/turn-bg.svg";
import avatarBg from "./img/avatar-bg.png";
import avatar from "./img/avatar.png";
import { useState } from "react";

export function GameHeader() {
  const [rivalName] = useState("@pashadurovoffasdjaksd");
  const [isMyTurn] = useState(false);
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
          <div className="gameHeader__infoBlock-key">Ваш противник:</div>
          <div className="gameHeader__infoBlock-value">{rivalName}</div>
        </div>
      </div>

      {/* RIGHT BLOCK */}
      <div className="gameHeader__right">
        <img src={rightBg} alt="" className="gameHeader__right-bg" />

        <div className="gameHeader__right-key">Ходит:</div>
        <div className="gameHeader__right-value">
          {isMyTurn ? "Вы" : "Соперник"}
        </div>
      </div>
    </div>
  );
}

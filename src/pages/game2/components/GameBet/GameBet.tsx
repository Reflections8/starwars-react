import "./styles/GameBet.css";
import bg from "./img/bg.svg";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function GameBet() {
  const { t } = useTranslation();
  const [currentBet] = useState("324,423");
  return (
    <div className="gameBet">
      <img src={bg} alt="" className="gameBet__bg" />
      <div className="gameBet__info">
        <div className="gameBet__info-value">{currentBet}</div>
        <div className="gameBet__info-key">{t("battleships.bet")}</div>
      </div>
    </div>
  );
}

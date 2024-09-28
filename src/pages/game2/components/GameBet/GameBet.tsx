import { useTranslation } from "react-i18next";
import { useBattleships } from "../../../../context/BattleshipsContext";
import bg from "./img/bg.svg";
import "./styles/GameBet.css";

export function GameBet() {
  const { t } = useTranslation();
  const { betAmount } = useBattleships();
  return (
    <div className="gameBet">
      <img src={bg} alt="" className="gameBet__bg" />
      <div className="gameBet__info">
        <div className="gameBet__info-value">{betAmount || 0}</div>
        <div className="gameBet__info-key">{t("battleships.bet")}</div>
      </div>
    </div>
  );
}

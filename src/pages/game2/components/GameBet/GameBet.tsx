import { useTranslation } from "react-i18next";
import { useBattleships } from "../../../../context/BattleshipsContext";
import { useSomething } from "../../../../context/SeaContexts";
import bg from "./img/bg.svg";
import "./styles/GameBet.css";

export function GameBet() {
  const { t } = useTranslation();
  const { betAmount } = useBattleships();
  const { betAmount: handshakeBetAmount } = useSomething();

  return (
    <div className="gameBet">
      <img src={bg} alt="" className="gameBet__bg" />
      <div className="gameBet__info">
        <div className="gameBet__info-value">
          {(Number(betAmount) * 1.9).toFixed(2) ||
            (Number(handshakeBetAmount) * 1.9).toFixed(2) ||
            0}
        </div>
        <div className="gameBet__info-key">{t("battleships.bet")}</div>
      </div>
    </div>
  );
}

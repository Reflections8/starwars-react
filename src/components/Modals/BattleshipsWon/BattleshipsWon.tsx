import { useTranslation } from "react-i18next";
import {
  gameStates,
  useBattleships,
} from "../../../context/BattleshipsContext";
import { useModal } from "../../../context/ModalContext";
import { CuttedButton } from "../../../ui/CuttedButton/CuttedButton";
import bg from "./img/bg.png";
import textImg from "./img/text.svg";
import "./styles/BattleshipsWon.css";

export function BattleshipsWon() {
  const { t } = useTranslation();
  const { openModal, closeModal } = useModal();
  const { setGameState, betAmount, betType } = useBattleships();

  const betTypeObject = {
    "0": "CREDITS",
    "1": "AKRON",
    "2": "TON",
  };
  return (
    <div className="battleshipsWon">
      <img src={bg} alt="" className="battleshipsWon__bg" />
      <img src={textImg} alt="" className="battleshipsWon__textImg" />

      <div className="battleshipsWon__text">
        <div className="battleshipsWon__text-key">
          {t("battleships.yourWinnings")}:
        </div>
        <div className="battleshipsWon__text-value">
          {betAmount * 1.9 || 0}{" "}
          {betTypeObject[String(betType) as keyof typeof betTypeObject]}
        </div>
      </div>
      <CuttedButton
        className="battleshipsWon__okBtn"
        size="small"
        text="OK"
        callback={(e) => {
          e.preventDefault();
          e.stopPropagation();
          closeModal!();
          setGameState(gameStates.NOT_STARTED);
          openModal!("seaBattle");
        }}
      />
    </div>
  );
}
